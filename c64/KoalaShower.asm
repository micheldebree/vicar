// Compile asm -> prg with http://www.theweb.dk/KickAssembler
// java -jar KickAss.jar KoalaShower.asm

//.var picture = LoadBinary("dollrider.kla", BF_KOALA)

:BasicUpstart2(start)

start:
	lda #$38
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
		lda screenRam + i * $100,x
		sta $d800 + i * $100,x
		lda colorRam + i * $100,x
		sta $d800 + i * $100,x
	}
	inx
	bne !loop-
	jmp *

.label pic = *
.label bitmap = pic + 2
.label screenRam = bitmap + 8000
.label colorRam = screenRam + 1000
.label background = colorRam + 1000

//.pc = $0c00	"ScreenRam" 		.fill picture.getScreenRamSize(), picture.getScreenRam(i)
//.pc = $1c00	"ColorRam:" colorRam: 	.fill picture.getColorRamSize(), picture.getColorRam(i)
//.pc = $2000	"Bitmap"		.fill picture.getBitmapSize(), picture.getBitmap(i)
