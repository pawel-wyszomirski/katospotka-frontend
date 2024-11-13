import streamlit as st
import pandas as pd
from datetime import datetime
import openai
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import folium
from streamlit_folium import st_folium
import json
import os
import pickle
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Konfiguracja OpenAI
openai.api_key = st.secrets["OPENAI_API_KEY"]

# Konfiguracja Google API
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    creds = None
    if 'token.pickle' in st.session_state:
        creds = st.session_state['token.pickle']
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        st.session_state['token.pickle'] = creds
    
    return build('gmail', 'v1', credentials=creds)

def extract_event_info(email_content):
    prompt = f"""Przeanalizuj poniższą treść maila i wyodrębnij następujące informacje:
    - Nazwa wydarzenia
    - Kategoria wydarzenia
    - Data wydarzenia
    - Miejsce wydarzenia (dokładny adres)
    - Organizator
    - Link do wydarzenia
    
    Treść maila:
    {email_content}
    
    Zwróć dane w formacie JSON."""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return json.loads(response.choices[0].message.content)

def get_coordinates(address):
    geolocator = Nominatim(user_agent="katospotka_app")
    try:
        location = geolocator.geocode(f"{address}, Katowice, Poland")
        if location:
            return [location.latitude, location.longitude]
    except GeocoderTimedOut:
        return None
    return None

def main():
    st.title("KatoSpotka - Wydarzenia w Katowicach")
    
    # Inicjalizacja sesji
    if 'events' not in st.session_state:
        st.session_state.events = []
    
    # Przycisk do odświeżania maili
    if st.button("Odśwież wydarzenia z Gmail"):
        try:
            service = get_gmail_service()
            results = service.users().messages().list(userId='me', q='to:katospotka@gmail.com').execute()
            messages = results.get('messages', [])
            
            new_events = []
            for message in messages:
                msg = service.users().messages().get(userId='me', id=message['id']).execute()
                email_content = msg['snippet']
                
                # Ekstrakcja informacji za pomocą OpenAI
                event_info = extract_event_info(email_content)
                
                # Dodanie koordynatów
                coordinates = get_coordinates(event_info['miejsce'])
                if coordinates:
                    event_info['coordinates'] = coordinates
                
                new_events.append(event_info)
            
            st.session_state.events = new_events
            st.success("Wydarzenia zostały zaktualizowane!")
            
        except Exception as e:
            st.error(f"Wystąpił błąd: {str(e)}")
    
    # Wyświetlanie mapy
    if st.session_state.events:
        m = folium.Map(location=[50.2649, 19.0238], zoom_start=13)
        
        for event in st.session_state.events:
            if 'coordinates' in event:
                folium.Marker(
                    event['coordinates'],
                    popup=f"{event['nazwa']}<br>{event['data']}<br>{event['miejsce']}"
                ).add_to(m)
        
        st_folium(m, width=800, height=600)
        
        # Wyświetlanie listy wydarzeń
        st.subheader("Lista wydarzeń")
        for event in st.session_state.events:
            st.write(f"**{event['nazwa']}**")
            st.write(f"Kategoria: {event['kategoria']}")
            st.write(f"Data: {event['data']}")
            st.write(f"Miejsce: {event['miejsce']}")
            st.write(f"Organizator: {event['organizator']}")
            st.write(f"[Link do wydarzenia]({event['link']})")
            st.write("---")

if __name__ == "__main__":
    main()