// Show a Koala Painter picture
// The (uncompressed) picture is supposed to be concatenated at the end of the output of this code,
// Compile asm -> prg with http://www.theweb.dk/KickAssembler
// java -jar KickAss.jar KoalaShower.asm

.label bitmap = $2000
.label screenRam = bitmap + 8000
.label colorRam = screenRam + 1000
.label background = colorRam + 1000

:BasicUpstart2(start)

start:
	lda #$18
	sta $d018
	lda #$d8
	sta $d016
	lda #$3b
	sta $d011
	lda #0
	sta $d020
	lda #background
	sta $d021
	ldx #0
!loop:
	.for (var i = 0; i < 4; i++) {
                        .var offs = i * $100
		lda offs + screenRam,x
		sta offs + $0400,x
		lda offs + colorRam,x
		sta offs + $d800,x
	}
	inx
	bne !loop-
	jmp *
            

// fill up with zero bytes up until the start of the bitmap ($2000)
// leave out two bytes because the koala picture's first two bytes are the load address, then bitmap starts
.fill bitmap - * - 2, 0


