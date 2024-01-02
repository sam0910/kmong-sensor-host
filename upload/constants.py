#########################
# VERSION : 2024-01-02  #
#########################

from micropython import const
from ucollections import namedtuple


AP_NAME = "Sensor-Setup"

# ACTUATOR
ACT_SPEED = 4
ACT_IN1 = 6
ACT_IN2 = 5
ACT_NC = 7
ACT_NO = 8  # act 8

# FAN
FAN_SPEED = 3


# SENSOR PMS7003
UTX = 1
URX = 2
# SENSOR I2C_1
I2C1_SDA = 17
I2C1_SCL = 16
# SENSOR I2C_2
I2C2_SDA = 8
I2C2_SCL = 9

SPI_MISO = 13
SPI_MOSI = 11
SPI_CLK = 12
SPI_CS = 10
SPI_AN = 14
