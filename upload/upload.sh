DEVICE_PORT=$(ls /dev/cu.usb* | head -n 1)
DOCKER_FIRMWARE=.
# source $IDF_PATH/export.sh
pip install --user mpremote
clear




echo ""
echo ""
echo "🚀 Sensor/Actuator Uploader"
echo ""
echo "Checking mpremote excutable ..."
mpremote --version | grep mpremote

if [ $? -ne 0 ]; then
    echo ""
    echo "mpremote is not excutable, please run on Finder window"
    pip install --user mpremote
    echo "Checking mpremote excutable AGAIN..."
    mpremote --version | grep mpremote
fi


echo ""
echo "-----------USB device list--------------"
ls /dev/cu.usb*
echo "----------------------------------------"


# mpremote connect /dev/cu.usbserial-110 + fs ls >/dev/null
# mpremote fs cp constants.py :constants.py
# mpremote fs ls :/

DEVICE_PORT=$(ls /dev/cu.usb* 2>/dev/null | head -n 1)
if [ -z "$DEVICE_PORT" ]; then
    echo ""
    echo "No device port found. Please connect your device and try again."
    exit 1
fi

while true; do
    echo "Detected USB device: $DEVICE_PORT"
    echo ""
    echo "Input device port number /dev/usbserial-xxxxx"
    echo "or press ENTER to use detected port."
    echo ""
    echo -n -e "🚀 Port number or ENTER : "
    read user_input

    if [ -z "$user_input" ]; then
        DEVICE_PORT=$DEVICE_PORT
        break
    elif [[ ! "$user_input" =~ ^[0-9]+$ ]]; then
        echo "Invalid input. Please enter a number."
    else
        DEVICE_PORT=/dev/cu.usbserial-$user_input
        break
    fi
done

echo "$DEVICE_PORT ... Selected"
echo ""

mpremote connect $DEVICE_PORT + fs ls

echo -n -e "🚀 Upload file name ? (constants.py): "
read user_input

if [ -z "$user_input" ]; then
    echo ""
    echo "uploading... ./constants.py"
    mpremote fs cp constants.py :constants.py
    mpremote fs cat :constants.py
    exit 0
else
    mpremote fs cp $user_input :constants.py
    exit 0
fi
