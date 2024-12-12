#define BLYNK_PRINT Serial

#define ROTATION_VPIN V0
#define MAX_ROTATION_VPIN V2
#define UPTIME_VPIN V5
#define TOTAL_UPTIME_VPIN V3
#define MAX_UPTIME_VPIN V4
#define WATER_VOLUME_VPIN V1
#define TOTAL_WATER_VOLUME_VPIN V6
#define MAX_WATER_VOLUME_VPIN V8
#define DATE_VPIN V7
#define WATER_VOLUME_MODE_VPIN V9
#define OVERRIDE_MODE_VPIN V10

#include <blynk_conf.h>
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <main.h>
#include <smarter_conf.h>

BaseType_t xTaskMain;
TaskHandle_t xTaskMainHandle;

TimerHandle_t xUptimeTimer;
TimerHandle_t xWaterVolumeTimer;
TimerHandle_t xTimeoutTimer;
TimerHandle_t xBlynkVirtualWriteTimer;

const char *ssid = "reset";
const char *password = "HotspotCecep";

static int uptime = 0;
static int total_uptime = 0;
static int max_uptime = 3600;

static int rotation = 0;
static int filtered_rotation = 0;
static int max_rotation = 180;
static int rotation_threshold = 10;

static float water_volume_coeff = 0.12F;
static float water_volume = 0.0F;
static float total_water_volume = 0.0F;
static float max_water_volume = 10000.0F;

static int water_volume_mode = 0;
static int override_mode = 1;

void vTaskMain(void *pvParameters);
void vUptimeTimerCallback(TimerHandle_t xTimer);
void vWaterVolumeTimerCallback(TimerHandle_t xTimer);
void setup_rtos();
void reset_virtual_pins();
void synch_virtual_pins();

BLYNK_WRITE(MAX_WATER_VOLUME_VPIN)
{
  max_water_volume = param.asFloat();
  Serial.print("Max water volume: ");
  Serial.println(max_water_volume);
}

BLYNK_WRITE(WATER_VOLUME_MODE_VPIN)
{
  water_volume_mode = param.asInt();
  Serial.print("Water volume mode: ");
  Serial.println(water_volume_mode);
}

BLYNK_WRITE(OVERRIDE_MODE_VPIN)
{
  override_mode = param.asInt();
  Serial.print("Override mode: ");
  Serial.println(override_mode);
}

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

void vTaskMain(void *pvParameters)
{
  char buff[255];
  int analog_rotation;

  while (1)
  {
    // float wvm = water_volume_mode ? total_water_volume : water_volume;
    // float wvm = water_volume;
    float wvm_s = water_volume * 10;
    if (uptime > max_uptime || wvm_s > max_water_volume)
    {
      xTimerStart(xTimeoutTimer, 0);
    }

    analog_rotation = analogRead(34);

    rotation = analog_rotation * 181 / 4096;

    filtered_rotation = rotation <= max_rotation ? rotation : max_rotation;
    filtered_rotation *= xTimerIsTimerActive(xTimeoutTimer) == pdTRUE ? 0 : 1;

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
      if (xTimerIsTimerActive(xUptimeTimer) == pdTRUE)
      {
        Serial.println("Resetting timer!");

        uptime = 0;
        xTimerReset(xUptimeTimer, 0);
        xTimerStop(xUptimeTimer, 0);

        water_volume = 0.0F;
        xTimerReset(xWaterVolumeTimer, 0);
        xTimerStop(xWaterVolumeTimer, 0);
      }
    }

    lcd.setCursor(0, 1);

    sprintf(buff, "%ds / %do / %.2fmL     ", uptime, filtered_rotation, wvm_s);

    Serial.println(buff);

    lcd.print(buff);

    lcd.setCursor(0, 2);

    String in_cooldown = xTimerIsTimerActive(xTimeoutTimer) == pdTRUE ? "In cooldown...   " : "Ready!          ";

    lcd.print(in_cooldown);

    Serial.println(in_cooldown);

    servo.write(filtered_rotation);

    Blynk.virtualWrite(ROTATION_VPIN, filtered_rotation);
    Blynk.virtualWrite(UPTIME_VPIN, uptime);
    Blynk.virtualWrite(TOTAL_UPTIME_VPIN, total_uptime);
    Blynk.virtualWrite(TOTAL_WATER_VOLUME_VPIN, total_water_volume);
    Blynk.virtualWrite(WATER_VOLUME_VPIN, wvm_s);
  }
}

void vUptimeTimerCallback(TimerHandle_t xTimer)
{
  uptime += 1;
  total_uptime += 1;

  xTimerReset(xTimer, 0);
}

void vBlynkVirtualWriteTimerCallback(TimerHandle_t xTimer)
{
}

void vWaterVolumeTimerCallback(TimerHandle_t xTimer)
{
  water_volume = filtered_rotation * water_volume_coeff;
  total_water_volume += water_volume;

  xTimerReset(xTimer, 0);
}

void vTimeoutTimerCallback(TimerHandle_t xTimer)
{
  Serial.println("Timeout done!");

  xTimerStop(xTimer, 0);
}

void setup_rtos()
{
  xUptimeTimer = xTimerCreate("Uptime Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)0, vUptimeTimerCallback);
  xWaterVolumeTimer = xTimerCreate("Water Volume Timer", 100 / portTICK_PERIOD_MS, pdTRUE, (void *)1, vWaterVolumeTimerCallback);
  xTimeoutTimer = xTimerCreate("Timeout Timer", 5000 / portTICK_PERIOD_MS, pdTRUE, (void *)2, vTimeoutTimerCallback);
  xBlynkVirtualWriteTimer = xTimerCreate("Blynk Virtual Write Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)3, vBlynkVirtualWriteTimerCallback);

  xTaskMain = xTaskCreate(vTaskMain, "Rotate Meter Task", 8192, NULL, 1, &xTaskMainHandle);

  vTaskDelete(NULL);
}

void reset_virtual_pins()
{
  /*You shouldn't reset the constraints LMAO*/
  Blynk.virtualWrite(ROTATION_VPIN, 0);
  Blynk.virtualWrite(UPTIME_VPIN, 0);
  Blynk.virtualWrite(TOTAL_UPTIME_VPIN, 0);
  Blynk.virtualWrite(WATER_VOLUME_VPIN, 0);
  Blynk.virtualWrite(TOTAL_WATER_VOLUME_VPIN, 0);
  Blynk.virtualWrite(DATE_VPIN, "Alpha");
  Serial.println("Pins reset!");
}

void synch_virtual_pins()
{
  Blynk.syncVirtual(MAX_UPTIME_VPIN);
  Blynk.syncVirtual(MAX_ROTATION_VPIN);
  Blynk.syncVirtual(MAX_WATER_VOLUME_VPIN);
  Blynk.syncVirtual(TOTAL_UPTIME_VPIN);
  Blynk.syncVirtual(TOTAL_WATER_VOLUME_VPIN);
  Blynk.syncVirtual(WATER_VOLUME_MODE_VPIN);
  Blynk.syncVirtual(OVERRIDE_MODE_VPIN);
  // Blynk.syncAll();
  Serial.println("Pins synchronized!");
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Configuring device...");

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  // reset_virtual_pins();
  synch_virtual_pins();
  setup_servo();
  setup_lcd();
  setup_rtos();
}

void loop()
{
  Blynk.run();
}