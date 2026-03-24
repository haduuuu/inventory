#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Wi-Fi credentials
const char* ssid = "Smart system";
const char* password = "smart@smart";

// Raspberry Pi MQTT broker
const char* mqtt_server = "192.168.10.210";  // Change to Pi’s IP
const int mqtt_port = 1883;

// MQTT topics
const char* topic_temp = "esp32/temperature";
const char* topic_hum  = "esp32/humidity";
const char* topic_gas  = "esp32/mq2";

// DHT11 setup
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// MQ2 setup
const int mq2Pin = 34;

// WiFi + MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  Serial.begin(115200);
  delay(10);
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP: "); Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5s");
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  dht.begin();
  pinMode(mq2Pin, INPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int mq2Value = analogRead(mq2Pin);

  if (!isnan(temp) && !isnan(hum)) {
    client.publish(topic_temp, String(temp).c_str());
    client.publish(topic_hum, String(hum).c_str());
  }
  client.publish(topic_gas, String(mq2Value).c_str());

  Serial.print("Temp: "); Serial.print(temp);
  Serial.print(" °C, Hum: "); Serial.print(hum);
  Serial.print(" %, MQ2: "); Serial.println(mq2Value);

  delay(2000);
}