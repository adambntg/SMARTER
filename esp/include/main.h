#include <Arduino.h>
#include <FreeRTOSConfig.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

byte degreeSymbol[8] = {
    0b00111,
    0b00101,
    0b00111,
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b00000};

int lcd_col = 20;
int lcd_row = 4;

LiquidCrystal_I2C lcd(0x27, lcd_col, lcd_row);
Servo servo;

void setup_servo()
{
    ESP32PWM::allocateTimer(0);
    ESP32PWM::allocateTimer(1);
    ESP32PWM::allocateTimer(2);
    ESP32PWM::allocateTimer(3);
    servo.setPeriodHertz(50);
    servo.attach(23);
}

void setup_lcd()
{
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Uptime / Rotation:");
    lcd.createChar(0, degreeSymbol);
}