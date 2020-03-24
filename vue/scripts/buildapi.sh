#!/bin/bash

usage="$(basename "$0") [-h] [-s n] -- program to generate backend API

where:
    -s  set service: eperusteet, ylops, amosaa or all (default)
    -h  show this help text"

service=all
while getopts ':hs:' option; do
  case "$option" in
    s) service=$OPTARG
      ;;
    h) echo "$usage"
       exit
       ;;
    :) printf "missing argument for -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
   \?) printf "illegal option: -%s\n" "$OPTARG" >&2
       echo "$usage" >&2
       exit 1
       ;;
  esac
done
shift $((OPTIND - 1))

show_eperusteet_missing_env_warn() {
  if [[ -z $EPERUSTEET_SERVICE_DIR ]]
  then
    printf "\x1b[1mEPERUSTEET_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mEPERUSTEET_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet/eperusteet-ylops-service\x1b[0m\n"
    exit 1
  fi
}

show_ylops_missing_env_warn() {
  if [[ -z $YLOPS_SERVICE_DIR ]]
  then
    printf "\x1b[1mYLOPS_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mYLOPS_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet-ylops/eperusteet-ylops-service\x1b[0m\n"
    exit 1
  fi
}

show_amosaa_missing_env_warn() {
  if [[ -z $AMOSAA_SERVICE_DIR ]]
  then
    printf "\x1b[1mAMOSAA_SERVICE_DIR\x1b[0m is not set.\n"
    printf "For example, call export \x1b[1mAMOSAA_SERVICE_DIR="
    printf "%s" "$HOME"
    printf "/eperusteet-amosaa/eperusteet-amosaa-service\x1b[0m\n"
    exit 1
  fi
}

generate_eperusteet() {
  EPERUSTEET_SPECFILE=${EPERUSTEET_SPECFILE:-"https://raw.githubusercontent.com/Opetushallitus/eperusteet/master/generated/eperusteet.spec.json"}
  echo "Using EPERUSTEET_SPECFILE=${EPERUSTEET_SPECFILE}"
  npx openapi-generator generate -c "${genconfig}" -i "${EPERUSTEET_SPECFILE}" -g typescript-axios
}

generate_ylops() {
  show_ylops_missing_env_warn
  ylopsgen="${rootdir}/src/generated/ylops"

  mkdir -p "${ylopsgen}"
  cd "${ylopsgen}" || exit 1


  specfile="$YLOPS_SERVICE_DIR/target/openapi/ylops.spec.json"
  cd "$YLOPS_SERVICE_DIR" \
    && mvn clean compile --batch-mode -B -Pgenerate-openapi \
    && cd "${ylopsgen}" \
    && echo "Building ylops api" \
    && pwd \
    && ls \
    && npx openapi-generator generate -c "${genconfig}" -i "$specfile" -g typescript-axios
}

generate_amosaa() {
  show_amosaa_missing_env_warn
  amosaagen="${rootdir}/src/generated/amosaa"

  mkdir -p "${amosaagen}"
  cd "${amosaagen}" || exit 1


  specfile="$AMOSAA_SERVICE_DIR/target/openapi/amosaa.spec.json"
  cd "$AMOSAA_SERVICE_DIR" \
    && mvn clean compile --batch-mode -B -Pgenerate-openapi \
    && cd "${amosaagen}" \
    && echo "Building amosaa api" \
    && pwd \
    && ls \
    && npx openapi-generator generate -c "${genconfig}" -i "$specfile" -g typescript-axios
}

generate() {
  rootdir=$(pwd)
  genconfig="${rootdir}/generator.config.json"
  if [[ $service = "all" ]]
  then
    generate_eperusteet
    generate_ylops
    generate_amosaa
  elif [[ $service = "eperusteet" ]]
  then
    generate_eperusteet
  elif [[ $service = "ylops" ]]
  then
    generate_ylops
  elif [[ $service = "amosaa" ]]
  then
    generate_amosaa
  else
    echo invalid service: $service
    exit 1
  fi
}

generate
