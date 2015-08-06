#!/bin/bash
# Test the koala shower code by running it in an emulator (Mac OSX)
# Compile 6502 code to .prg
java -jar KickAss.jar KoalaShower.asm
# Prepend the code to a Koala picture
cat KoalaShower.prg dollrider.kla > test.prg
# Run the prg with whatever emulator is installed (VICE)
open test.prg
