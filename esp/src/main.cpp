#define BLYNK_PRINT Serial
#define BLYNK_TEMPLATE_ID "TMPL6kYMQkaS0"
#define BLYNK_TEMPLATE_NAME "Zenkai"
#define BLYNK_AUTH_TOKEN "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I"
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

const char *ssid = "Wokwi-GUEST";
const char *password = "";

BLYNK_WRITE(V0)
{
  int ni = param.asInt();
  Serial.println(ni);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);
}

void loop()
{
  // put your main code here, to run repeatedly:
  Blynk.run();
}
