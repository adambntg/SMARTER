#define BLYNK_PRINT Serial

#define ROTATION_VPIN V0
#define MAX_ROTATION_VPIN V2
#define UPTIME_VPIN V5
#define TOTAL_UPTIME_VPIN V3
#define MAX_UPTIME_VPIN V4

#include <incontinens.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <main.h>

const char *ssid = "Wokwi-GUEST";
const char *password = "";

int uptime = 0;
int total_uptime = 0;
int max_uptime = 5;

BaseType_t xTaskRotateMeter;
TaskHandle_t xTaskRotateMeterHandle;

TimerHandle_t xUptimeTimer;

int max_rotation = 90;
int rotation_threshold = 10;

void vTaskRotateMeter(void *pvParameters);

BLYNK_WRITE(MAX_ROTATION_VPIN)
{
  max_rotation = param.asInt();
  Serial.print("Max rotation: ");
  Serial.println(max_rotation);
}

void vTaskRotateMeter(void *pvParameters)
{
  char buff[255];

  while (1)
  {
    int anRe = analogRead(34);

    int rotation = anRe * 181 / 4096;

    int filtered_rotation = rotation <= max_rotation ? rotation : max_rotation;
    filtered_rotation *= uptime > max_uptime ? 0 : 1;

    if (rotation > max_uptime)
    {
      if (xTimerIsTimerActive(xUptimeTimer) == pdFALSE)
      {
        xTimerStart(xUptimeTimer, 0);
      }
    }
    else
    {
      if (xTimerIsTimerActive(xUptimeTimer) != pdFALSE)
      {
        uptime = 0;
        Serial.println("Resetting timer!");
        xTimerReset(xUptimeTimer, 0);
        xTimerStop(xUptimeTimer, 0);
      }
    }

    lcd.setCursor(0, 1);

    sprintf(buff, "%ds / %dC   ", uptime, filtered_rotation);

    lcd.print(buff);

    servo.write(filtered_rotation);

    Blynk.virtualWrite(ROTATION_VPIN, filtered_rotation);
    Blynk.virtualWrite(UPTIME_VPIN, uptime);
    Blynk.virtualWrite(TOTAL_UPTIME_VPIN, total_uptime);
  }
}

void vUptimeTimerCallback(TimerHandle_t xTimer)
{
  char buff[255];
  uptime += 1;
  total_uptime += 1;
  sprintf(buff, "Uptime: %d / Total Uptime: %d", uptime, total_uptime);
  Serial.println(buff);
  xTimerReset(xTimer, 0);
}

void setup_rtos()
{
  xTaskRotateMeter = xTaskCreate(vTaskRotateMeter, "Rotate Meter Task", 4096, NULL, 1, &xTaskRotateMeterHandle);

  xUptimeTimer = xTimerCreate("Uptime Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)0, vUptimeTimerCallback);

  vTaskDelete(NULL);
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Configuring device...");

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  setup_servo();
  setup_lcd();
  setup_rtos();

  // vTaskStartScheduler();
}

void loop()
{
  Blynk.run();
}