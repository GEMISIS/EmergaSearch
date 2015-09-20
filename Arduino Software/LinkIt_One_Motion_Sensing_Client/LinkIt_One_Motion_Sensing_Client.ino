#include <LTask.h>
#include <LWiFi.h>
#include <LWiFiClient.h>

// Wireless router login information
#define WIFI_AP "ers"
#define WIFI_PASSWORD "766EDE7338"
#define WIFI_AUTH LWIFI_WEP

// Website URL Address (Port specified below)
#define SITE_URL "192.168.1.101"

#define CLIENT_ID "Demo Room 1"

LWiFiClient c;

// The amount of motion detected.
int motionValue = 0;
// PIR sensor is on pin 10 for this project, you can change this of course.
int motionPin = 10;

void setup()
{
  Serial.begin(9600);
  LWiFi.begin();
  pinMode(motionPin, INPUT);

  Serial.println("Connecting to AP...");
  while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    delay(1000);
  }
}

void loop()
{
  // A value of 1 indicates motion, 0 indicates no motion
  motionValue = digitalRead(motionPin);
  delay (700) ;
  
  Serial.print("Motion value ");
  Serial.println(motionValue);

  if(motionValue)
  {
    // Reconnect each time in order to not keep a connection going the whole time.
    // This will reduce traffic on the server for rooms that are not detecting motion.
    Serial.println("Sending motion data to website...");
    while (0 == c.connect(SITE_URL, 8080))
    {
      Serial.println("Re-Connecting to WebSite");
      delay(1000);
    }

    c.print("GET /motionDetected/?");
    // Send the client ID.
    c.print("client=" CLIENT_ID);
    // Sending over the sensor data.
    {
      c.print("&motion=");
      c.print(1);
    }
    c.println(" HTTP/1.1");
    c.println("Host: " SITE_URL);
    // Force the connection to close each time to reduce traffic on the server.
    c.println("Connection: close");
    c.println();
  }
}

