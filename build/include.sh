#!/usr/bin/env bash

NO_COLOR="\033[0m"
OK_COLOR="\033[32m"
INFO_COLOR="\033[36m"
ERROR_COLOR="\033[31m"
WARN_COLOR="\033[33m"
OK_STRING="${OK_COLOR}[OK]${NO_COLOR}"
INFO_STRING="${INFO_COLOR}[INFO]${NO_COLOR}"
ERROR_STRING="${ERROR_COLOR}[ERROR]${NO_COLOR}"
WARN_STRING="${WARN_COLOR}[WARNING]${NO_COLOR}"

# Prints a message based on the given code
# $1 - Exit code of a command
# $2 - Message on success
# $3 - Message on error
function f_process_command {
  if [[ $1 == 0 ]]
  then
    echo -e "${OK_STRING} $2"
  else
    echo -e "${ERROR_STRING} $3"
    exit 1
  fi
}

# Prints an info message
# $1 - The message
function f_info_log {
  echo -e "${INFO_STRING} $1"
}

# Prints an error message
# $1 - The message
function f_error_log {
  echo -e "${ERROR_STRING} $1"
}

# Prints a success message
# $1 - The message
function f_success_log {
  echo -e "${OK_STRING} $1"
}

# Prints a success message
# $1 - The message
function f_warning_log {
  echo -e "${WARN_STRING} $1"
}
