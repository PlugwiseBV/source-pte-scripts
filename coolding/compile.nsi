Name "Install Coolding Plugin"
OutFile "install.exe"


; The default installation directory

InstallDir "$PROGRAMFILES\Plugwise\"

; Request application privileges for Windows Vista
RequestExecutionLevel user

;--------------------------------

; Pages

Page directory
Page instfiles

;--------------------------------

; The stuff to install
Section "" ;No components page, name is not important

  CreateDirectory "$INSTDIR\Plugwise Source\www\sys\switch\"
  ; Set output path to the installation directory.
  SetOutPath "$INSTDIR\Plugwise Source\www\coolding"
  
  File /nonfatal /a /r "coolding_source\"

  ; Set output path to the installation directory.
  SetOutPath "$INSTDIR\Plugwise Coolding\"
  
  File /nonfatal /a /r "coolding_viewer\"

  CreateShortCut "$DESKTOP\Plugin_coolding.lnk" "$INSTDIR\Plugwise Coolding\plugwise.exe" "" "$INSTDIR\Plugwise Coolding\plugwise.ico" 0
  Exec "$INSTDIR\Plugwise Coolding\plugwise.exe"
SectionEnd ; end the section
