#include <Arduino.h>
#include <FreeRTOSConfig.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define LCDCOL 20
#define LCDROW 4

int lcd_col = 20;
int lcd_row = 4;

TaskHandle_t xTaskRotateHandle;
TaskHandle_t xTaskRotateMeterHandle;

TimerHandle_t xSimpleTimer;

LiquidCrystal_I2C lcd(0x27, lcd_col, lcd_row);

Servo servo;

// put function declarations here:

void vTaskRotateMeter(void *pvParameters);
void vTaskLCDBar(void *pvParamters);

void vTaskRotateMeter(void *pvParameters)
{
  int number = 10;

  char buff[255];

  const TickType_t xDelay = 2000 / portTICK_PERIOD_MS;

  while (1)
  {
    int anRe = analogRead(12);

    // sprintf(buff, "AnalRead : %d", anRe);

    // Serial.println(buff);

    // Serial.println(anRe);

    int rotation = anRe * 180 / 4096;

    servo.write(rotation);

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
  configASSERT(xTimer);

  Serial.println("Simple timer done!");
  xTimerReset(xTimer, 0);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Blin");

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);

  int number = 100;

  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo.setPeriodHertz(50);
  servo.attach(23);

  xTaskCreate(vTaskRotateMeter, "Rotate Meter Task", 2048, NULL, 1, &xTaskRotateMeterHandle);
  xTaskCreate(vTaskLCDBar, "Display LCD Bar Task", 2048, NULL, 0, NULL);

  xSimpleTimer = xTimerCreate("Simple Timer", 1000 / portTICK_PERIOD_MS, pdTRUE, (void *)0, vSimpleTimerCallback);

  if (xSimpleTimer)
  {
    Serial.println("Timer is valid");
  }
  else
  {
    Serial.println("Timer is invalid!");
  }

  if (xTimerStart(xSimpleTimer, 0) != pdPASS)
  {
  }

  // vTaskStartScheduler();

  vTaskDelete(NULL);
}

void loop()
{
}