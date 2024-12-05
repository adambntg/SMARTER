#define BLYNK_PRINT Serial

#define ROTATION_VPIN V0
#define MAX_ROTATION_VPIN V2
#define UPTIME_VPIN V5
#define TOTAL_UPTIME_VPIN V3
#define MAX_UPTIME_VPIN V4
#define WATER_VOLUME_VPIN V1
#define TOTAL_WATER_VOLUME_VPIN V6
#define DATE_VPIN V7

#include <incontinens.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <main.h>

BaseType_t xTaskRotateMeter;
TaskHandle_t xTaskRotateMeterHandle;

TimerHandle_t xUptimeTimer;
TimerHandle_t xWaterVolumeTimer;

const char *ssid = "Wokwi-GUEST";
const char *password = "";

int uptime = 0;
int total_uptime = 0;
int max_uptime = 999999999;

int rotation = 0;
int filtered_rotation = 0;
int max_rotation = 180;
int rotation_threshold = 10;

float water_volume_coeff = 0.01F;
float water_volume = 0.0F;
float total_water_volume = 0.0F;

void vTaskRotateMeter(void *pvParameters);
void vUptimeTimerCallback(TimerHandle_t xTimer);
void vWaterVolumeTimerCallback(TimerHandle_t xTimer);
void setup_rtos();
void reset_hey_daddy();
void yharon_synch();

BLYNK_WRITE(MAX_ROTATION_VPIN)
{
  max_rotation = param.asInt();
  Serial.print("Max rotation: ");
  Serial.println(max_rotation);
}

BLYNK_WRITE(MAX_UPTIME_VPIN)
{
  max_uptime = param.asInt();
  Serial.print("Max uptime: ");
  Serial.println(max_uptime);
}

BLYNK_WRITE(TOTAL_UPTIME_VPIN)
{
  total_uptime = param.asInt();
  Serial.print("Total uptime: ");
  Serial.println(total_uptime);
}

BLYNK_WRITE(TOTAL_WATER_VOLUME_VPIN)
{
  total_water_volume = param.asFloat();
  Serial.print("Total water volume: ");
  Serial.println(total_water_volume);
}

void vTaskRotateMeter(void *pvParameters)
{
  char buff[255];

  while (1)
  {
    int anRe = analogRead(34);

    rotation = anRe * 181 / 4096;

    filtered_rotation = rotation <= max_rotation ? rotation : max_rotation;
    filtered_rotation *= uptime > max_uptime ? 0 : 1;

    if (rotation > rotation_threshold)
    {
      if (xTimerIsTimerActive(xUptimeTimer) == pdFALSE)
      {
        Serial.println("Starting timer!");
        xTimerStart(xUptimeTimer, 0);
        xTimerStart(xWaterVolumeTimer, 0);
      }
    }
    else
    {
      if (xTimerIsTimerActive(xUptimeTimer) != pdFALSE)
      {
        Serial.println("Resetting timer!");

        uptime = 0;
        xTimerStop(xUptimeTimer, 0);
        xTimerReset(xUptimeTimer, 0);

        water_volume = 0.0F;
        xTimerStop(xWaterVolumeTimer, 0);
        xTimerReset(xWaterVolumeTimer, 0);
      }
    }

    lcd.setCursor(0, 1);

    sprintf(buff, "%ds / %ddeg   ", uptime, filtered_rotation);

    lcd.print(buff);

    servo.write(filtered_rotation);

    Blynk.virtualWrite(ROTATION_VPIN, filtered_rotation);
    Blynk.virtualWrite(UPTIME_VPIN, uptime);
    Blynk.virtualWrite(TOTAL_UPTIME_VPIN, total_uptime);
    Blynk.virtualWrite(TOTAL_WATER_VOLUME_VPIN, total_water_volume);
  }
}

void vUptimeTimerCallback(TimerHandle_t xTimer)
{
  char buff[255];
  uptime += 1;
  total_uptime += 1;

  // sprintf(buff, "Uptime: %ds / Total Uptime: %ds", uptime, total_uptime);
  // Serial.println(buff);

  xTimerReset(xTimer, 0);
}

void vWaterVolumeTimerCallback(TimerHandle_t xTimer)
{
  char buff[255];

  water_volume = filtered_rotation * water_volume_coeff;
  total_water_volume += water_volume;

  // sprintf(buff, "Water Volume: %.2fml", water_volume);
  // Serial.println(buff);

  xTimerReset(xTimer, 0);
}

void setup_rtos()
{
  xTaskRotateMeter = xTaskCreate(vTaskRotateMeter, "Rotate Meter Task", 8192, NULL, 1, &xTaskRotateMeterHandle);

  xUptimeTimer = xTimerCreate("Uptime Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)0, vUptimeTimerCallback);
  xWaterVolumeTimer = xTimerCreate("Water Volume Timer", 100 / portTICK_PERIOD_MS, pdTRUE, (void *)1, vWaterVolumeTimerCallback);

  vTaskDelete(NULL);
}

void reset_hey_daddy()
{
  /*You shouldn't reset the constraints LMAO*/
  Blynk.virtualWrite(ROTATION_VPIN, 0);
  // Blynk.virtualWrite(MAX_ROTATION_VPIN, 0);
  Blynk.virtualWrite(UPTIME_VPIN, 0);
  Blynk.virtualWrite(TOTAL_UPTIME_VPIN, 0);
  // Blynk.virtualWrite(MAX_UPTIME_VPIN, 0);
  Blynk.virtualWrite(WATER_VOLUME_VPIN, 0);
  Blynk.virtualWrite(TOTAL_WATER_VOLUME_VPIN, 0);
  Blynk.virtualWrite(DATE_VPIN, "Alpha");
  Serial.println("Pins reset!");
}

void yharon_synch()
{
  Blynk.syncVirtual(MAX_UPTIME_VPIN);
  Blynk.syncVirtual(MAX_ROTATION_VPIN);
  Blynk.syncVirtual(TOTAL_UPTIME_VPIN);
  Blynk.syncVirtual(TOTAL_WATER_VOLUME_VPIN);
  Serial.println("Pins synchronized!");
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Configuring device...");

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  reset_hey_daddy();
  // yharon_synch();
  setup_servo();
  setup_lcd();
  setup_rtos();

  // vTaskStartScheduler();
}

void loop()
{
  Blynk.run();
}