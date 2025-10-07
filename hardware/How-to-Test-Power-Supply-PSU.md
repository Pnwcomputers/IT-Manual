# 🔌 How to Test a Power Supply (PSU)

If your system is having issues turning on, you can check if your power supply unit (PSU) is functioning properly by performing a test.

You will need a paper clip or a PSU jumper to perform this test.

**IMPORTANT:** Make sure that you jump the correct pins when testing your PSU. Jumping the incorrect pins may result in injury and damages to the PSU. Use the image below to see what pins you need to jump.

## How To Test a PSU

1. Shut off your PSU.

2. Unplug all cables from the PSU except for the main AC cable and the 24-pin cable.

3. Locate pin 16 and pin 17 on your 24-pin cable.

   **Note:** To find pin 16 and pin 17, count from the left with the clip facing up and the pins facing toward you. They will be the 4th and 5th pins when counting from left to right as shown in the photo example below.

4. Bend your paper clip so the ends can be inserted into pin 16 and pin 17.

   **Note:** If you're using a PSU jumper, insert the ends into pin 16 and pin 17.

5. Turn on the PSU.

6. See if the PSU fan turns. If it does, the PSU is functioning normally.

   **Note:** Many Corsair PSUs have a zero-RPM feature that results in the fan only spinning for a moment after the PSU is powered on. This still indicates that the PSU is functioning normally.

![24-Pin Connector with Paperclip](images/24-pin-paperclip.jpg)
*24-pin connector showing pin locations for testing*

## Test a PSU with a Multimeter

To test your PSU with a multimeter, use the following chart and continue from the previous steps:

### 24-Pin ATX Connector Pinout

| Signal | Pin | Pin | Signal |
|--------|-----|-----|--------|
| +3.3 V | 1 | 13 | +3.3 V |
| +3.3 V | 2 | 14 | -12 V |
| Ground | 3 | 15 | Ground |
| +5 V | 4 | 16 | Power on |
| Ground | 5 | 17 | Ground |
| +5 V | 6 | 18 | Ground |
| Ground | 7 | 19 | Ground |
| Power Good | 8 | 20 | None |
| +5 V standby | 9 | 21 | +5 V |
| +12 V | 10 | 22 | +5 V |
| +12 V | 11 | 23 | +5 V |
| +3.3 V | 12 | 24 | Ground |

### Testing Steps

1. Set your multimeter to the appropriate DC metering mode according to the manufacturer.

2. Place the black test lead in contact with the 24th pin or any of the other Ground pins.

3. While the black test lead is in contact with the Ground pin, place the red test lead into the pins individually (1-2, 4, 6, 9-14, 21-23) to get a reading of the voltages from your PSU.

4. The readouts for a working PSU would have the values listed below:

| Pin | Tolerance | Voltage Range |
|-----|-----------|---------------|
| 1 | +3.3 V ±5% | +3.135 to +3.465 V |
| 2 | +3.3 V ±5% | +3.135 to +3.465 V |
| 4 | +5 V ±5% | +4.75 to +5.25 V |
| 6 | +5 V ±5% | +4.75 to +5.25 V |
| 9 | +5 V ±5% | +4.75 to +5.25 V |
| 10 | +12 V ±5% | +11.40 to +12.60 V |
| 11 | +12 V ±5% | +11.40 to +12.60 V |
| 12 | +3.3 V ±5% | +3.135 to +3.465 V |
| 13 | +3.3 V ±5% | +3.135 to +3.465 V |
| 14 | -12 V ±10% | -10.80 to -13.20 V |
| 21 | +5 V ±5% | +4.75 to +5.25 V |
| 22 | +5 V ±5% | +4.75 to +5.25 V |
| 23 | +5 V ±5% | +4.75 to +5.25 V |

## Test a PSU with a Power Supply Tester

Another way to test your PSU is to use a power supply tester, like the one pictured (others can be used, this is just the most common). To use one, follow the steps below:

![Power Supply Tester](images/psu-tester.jpg)
*Power supply tester with LCD display*

1. Shut off the computer and make sure the PSU is turned off.

2. Disconnect all modular cables, if applicable.

3. Plug in the 24-pin cable along with the 8-pin (4+4) CPU cable into the tester and to the PSU.

4. Plug in the AC power cord and flip the power switch to the On position.

   **Note:** Many Corsair PSUs have a zero-RPM feature that results in the fan only spinning for a moment after the PSU is powered on. This still indicates that the PSU is functioning normally.

5. The LCD screen on the PSU tester should power on and show numeric readouts.

   **Note:** See readouts range below.

6. PG Values are usually considered normal if it falls within the range of 100ms - 500ms, but can be lower than 100ms at times. 0ms PG values would be considered a failing PSU.

7. To test peripheral/SATA power connections, unplug the PSU from the AC power cable and clip the switch to the off position.

8. Plug in either a single peripheral or SATA connection and flip the switch on the PSU back to the on position after plugging in the AC power cable.

9. The lights on the left side of the tester should light up to indicate power delivery.

   **Note:** All three lights should light up when connecting a SATA connection (+12 V, +3.3 V, & +5 V). Only +12 V and +5 V will power on when connecting all other peripheral cables.

10. Unplug the AC power cable when testing is complete before unplugging the PSU cables.

### Expected Voltage Ranges

| Tolerance | Voltage Range |
|-----------|---------------|
| +3.3 V ±5% | +3.135 to +3.465 V |
| +5 V ±5% | +4.75 to +5.25 V |
| +12 V ±5% | +11.40 to +12.60 V |
| -12 V ±10% | -10.80 to -13.20 V |
| +5 VSB ±5% | +4.75 to +5.25 V |

If any of the voltage ranges are outside of the parameters, submit a ticket through our site and provide photos of this to your support agent.

## Important Notes for Newer PSUs

- When -12V was made "optional" in the ATX 3.0 and newer spec, Corsair decided to remove the -12V. With these testers, instead of showing ZERO for the -12V, they'll usually show around -13+, which is a false reading.

- Also, the PG signal requirements have been reduced from <500ms and <500ms for T1 and T3 respectively, to <200ms and <100ms since the latest ATX12V revision. So most of these testers will error on the "PG" portion with newer PSUs that follow the newer spec.
