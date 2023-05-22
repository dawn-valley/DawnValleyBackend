#!/bin/bash

DT=$(date +%Y-%m-%d-%H-%M)
DB="dawn-valley-head-less-cms"
DIR="dbbak"
FILE="${DT}.tgz"
COLLECTIONS=( _preferences categories media posts tags users )
# show collections
# printf "%s\n" "${COLLECTIONS[@]}"

mkdir "${DIR}" -p
cd "${DIR}"
mkdir "${DT}"

for i in "${COLLECTIONS[@]}"
do
  : 
  CMD="mongoexport --db "${DB}" --collection "${i}" --out "${DT}/${i}".json --jsonArray"
  echo $CMD
  $CMD
done

tar -czvf "${FILE}" "${DT}"
rm "${DT}" -r
cd ../..