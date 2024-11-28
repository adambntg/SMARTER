#define BLYNK_PRINT Serial
#define BLYNK_TEMPLATE_ID "TMPL6kYMQkaS0"
#define BLYNK_TEMPLATE_NAME "Zenkai"
#define BLYNK_AUTH_TOKEN "cLyVhq_I2lD617RdlxpZji_5LoHrbN6I"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>
#include <main.h>

const char *ssid = "Wokwi-GUEST";
const char *password = "";

BaseType_t xTaskRotateMeter;
TaskHandle_t xTaskRotateMeterHandle;

BaseType_t xTaskLCDBar;

TimerHandle_t xSimpleTimer;

int MAX_ROT = 90;

void vTaskRotateMeter(void *pvParameters);
void vTaskLCDBar(void *pvParamters);

void vTaskRotateMeter(void *pvParameters)
{
  char buff[255];

  while (1)
  {
    int anRe = analogRead(34);

    // sprintf(buff, "AnalRead : %d", anRe);

    // Serial.println(buff);

    // Serial.println(anRe);

    int rotation = anRe * 181 / 4096;

    int filtered_rotation = rotation <= MAX_ROT ? rotation : MAX_ROT;

    servo.write(filtered_rotation);

    Blynk.virtualWrite(V0, filtered_rotation);

    // Serial.println(rotation);

    // vTaskDelay(xDelay);
  }
}

void vTaskLCDBar(void *pvParameters)
{

  for (int i = 0; i < 20; i += 2)
  {
    lcd.setCursor(i, 0);
    lcd.print("[]");

    vTaskDelay(100 / portTICK_PERIOD_MS);
  }

  vTaskDelete(NULL);
}

void vSimpleTimerCallback(TimerHandle_t xTimer)
{
  Serial.println("Simple timer done!");
  xTimerReset(xTimer, 0);
}

void setup_rtos()
{
  xTaskRotateMeter = xTaskCreate(vTaskRotateMeter, "Rotate Meter Task", 4096, NULL, 1, &xTaskRotateMeterHandle);
  xTaskLCDBar = xTaskCreate(vTaskLCDBar, "Display LCD Bar Task", 2048, NULL, 0, NULL);

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