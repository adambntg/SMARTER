#define BLYNK_PRINT Serial
#define BLYNK_TEMPLATE_ID "TMPL6kYMQkaS0"
#define BLYNK_TEMPLATE_NAME "Zenkai"
#define BLYNK_AUTH_TOKEN "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I"

#define ROTATION_VPIN V0
#define MAX_ROTATION_VPIN V2
#define TOTAL_UPTIME_VPIN V3

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <main.h>

const char *ssid = "Wokwi-GUEST";
const char *password = "";

int initial_uptime = 0;
int total_uptime = 0;

BaseType_t xTaskRotateMeter;
TaskHandle_t xTaskRotateMeterHandle;

BaseType_t xTaskLCDBar;

TimerHandle_t xSimpleTimer;

int max_rot = 90;
int open_threshold = 10;

void vTaskRotateMeter(void *pvParameters);
void vTaskLCDBar(void *pvParamters);

BLYNK_WRITE(MAX_ROTATION_VPIN)
{
  max_rot = param.asInt();
  Serial.print("Max rotation: ");
  Serial.println(max_rot);
}

void vTaskRotateMeter(void *pvParameters)
{
  char buff[255];

  initial_uptime = millis();

  while (1)
  {
    int anRe = analogRead(34);

    int rotation = anRe * 181 / 4096;

    int filtered_rotation = rotation <= max_rot ? rotation : max_rot;

    int final_uptime = millis();
    int delta_uptime = (final_uptime - initial_uptime) / 1000;

    if (filtered_rotation < open_threshold)
    {
      total_uptime += delta_uptime;
      if (delta_uptime > 0)
      {
        Serial.println(delta_uptime);
      }
      initial_uptime = final_uptime;
    }

    lcd.setCursor(0, 1);

    sprintf(buff, "%ds / %dC", delta_uptime, filtered_rotation);

    lcd.print(buff);

    servo.write(filtered_rotation);

    Blynk.virtualWrite(ROTATION_VPIN, filtered_rotation);
    Blynk.virtualWrite(TOTAL_UPTIME_VPIN, total_uptime);
  }
}

void vSimpleTimerCallback(TimerHandle_t xTimer)
{
  // Serial.println("Simple timer done!");
  xTimerReset(xTimer, 0);
}

void setup_rtos()
{
  xTaskRotateMeter = xTaskCreate(vTaskRotateMeter, "Rotate Meter Task", 4096, NULL, 1, &xTaskRotateMeterHandle);

  xSimpleTimer = xTimerCreate("Simple Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)0, vSimpleTimerCallback);
  xTimerStart(xSimpleTimer, 0);

  vTaskDelete(NULL);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Blin");

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