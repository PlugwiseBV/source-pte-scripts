;Written by Ersin Topuz

;--------------------------------
;Include Modern UI


  !include "MUI2.nsh"

;--------------------------------
;General

  Name "Install Coolding Plugin"
  OutFile "install.exe"

  ; The default installation directory

  InstallDir "$PROGRAMFILES\Plugwise\Plugwise Source\"
  InstallDirRegKey HKLM "Software\Plugwise Source" "Path"

  ; Request application privileges for Windows Vista
  RequestExecutionLevel admin


;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING

;--------------------------------

; Pages

;Page directory
;Page instfiles
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES

;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

;--------------------------------

; The stuff to install
Section "" ;No components page, name is not important
  ExecWait 'taskkill /im PlugwisePC.exe'

  RMDir "$INSTDIR\Plugwise Coolding\"

  ${If} ${FileExists} "$INSTDIR\www\coolding\cache\*"
    RMDir "$INSTDIR\www\coolding\html\"
    RMDir "$INSTDIR\www\coolding\connect\"

    ; Set output path to the installation directory.
    SetOutPath "$INSTDIR\www\coolding\html"
  
    File /nonfatal /a /r "coolding_source\html\"

    ; Set output path to the installation directory.
    SetOutPath "$INSTDIR\www\coolding\connect"
  
    File /nonfatal /a /r "coolding_source\connect\"

  ${Else}
    RMDir "$INSTDIR\www\coolding\"

    ; Set output path to the installation directory.
    SetOutPath "$INSTDIR\www\coolding"
  
    File /nonfatal /a /r "coolding_source\"

  ${EndIf}

  CreateDirectory "$INSTDIR\www\sys\switch\"
  CreateDirectory "$INSTDIR\www\sys\schedules\"

  ; Set output path to the installation directory.
  SetOutPath "$INSTDIR\Plugwise Coolding\"
  
  File /nonfatal /a /r "coolding_viewer\"

  CreateShortCut "$DESKTOP\Plugin_coolding.lnk" "$INSTDIR\Plugwise Coolding\plugwise.exe" "" "$INSTDIR\Plugwise Coolding\plugwise.ico" 0
  Exec "$INSTDIR\Plugwise Coolding\plugwise.exe"

SectionEnd ; end the section

; Automatically close install when done
AutoCloseWindow true
