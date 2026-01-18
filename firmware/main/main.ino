#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <FirebaseESP32.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// ==========================================
// CONFIGURATION - UPDATE THESE VALUES
// ==========================================

// WiFi Credentials
#define WIFI_SSID "LAPTOP-710U6N93"
#define WIFI_PASSWORD "nagesh@123"

// Firebase Logic
// Insert your API Key and Realtime Database URL
#define API_KEY "AIzaSyDgYvSC1EK8FbEj_PuFWvYWBHANU2jdUQU"
#define DATABASE_URL "https://cold-storage-95af9-default-rtdb.firebaseio.com" 

// Telegram alerts now handled by website backend 

// Thresholds
const float TEMP_HIGH_THRESHOLD = 8.0;
const float TEMP_LOW_THRESHOLD = 2.0;

// Hardware Pins
const int BUZZER_PIN = 26; // Change to your buzzer pin
// SHT31 is I2C (SDA=21, SCL=22 by default on many ESP32s)

// ==========================================
// GLOBALS
// ==========================================

Adafruit_SHT31 sht31 = Adafruit_SHT31();

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long alertPrevMillis = 0;
// Log data every 60 seconds
const long sendDataInterval = 60000; 
// Limit alerts to once every 5 minutes to avoid spam
const long alertInterval = 300000; 

bool signupOK = false;
bool alertActive = false;

// Telegram alerts handled by website - no function needed here

void setup() {
  Serial.begin(115200);
  
  // Initialize Pins
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Initialize Sensor
  if (!sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31");
    // while (1) delay(1); // Allow to continue even without sensor for testing connectivity
  }
  Serial.println("SHT31 Found!");

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // Firebase Config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Sign up
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase Auth Successful");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Read Sensor
  float t = sht31.readTemperature();
  float h = sht31.readHumidity();

  if (!isnan(t)) {  // Check if read failed
    Serial.print("Temp: "); Serial.print(t); Serial.println(" C");
    
    // Alert Logic - Only Buzzer (Website handles Telegram)
    if (t > TEMP_HIGH_THRESHOLD || t < TEMP_LOW_THRESHOLD) {
      digitalWrite(BUZZER_PIN, HIGH); // Turn ON Buzzer
      alertActive = true;
    } else {
      digitalWrite(BUZZER_PIN, LOW); // Turn OFF Buzzer
      alertActive = false;
    }

    // Data Logging (Every minute)
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > sendDataInterval || sendDataPrevMillis == 0)) {
       sendDataPrevMillis = millis();
       
       // Create a JSON object path based on timestamp or just push
       // We'll use push for a list of logs
       FirebaseJson json;
       json.set("temperature", t);
       json.set("humidity", h);
       json.set("timestamp", millis()); // In a real app, use NTP for real time
       
       if (Firebase.pushJSON(fbdo, "/logs", json)) {
          Serial.println("Data pushed to Firebase!");
       } else {
          Serial.println(fbdo.errorReason());
       }
       
       // Also update current status for real-time view
       if (Firebase.setFloat(fbdo, "/current_status/temperature", t)) {}
       if (Firebase.setFloat(fbdo, "/current_status/humidity", h)) {}
       if (Firebase.setInt(fbdo, "/current_status/last_update", millis())) {} 
    }
  } else {
    Serial.println("Failed to read temperature");
  }
  
  delay(1000); // Poll every second
}

// Telegram alerts now handled by website backend
// ESP32 only reads sensor, controls buzzer, and sends data to Firebase
