#!/bin/bash

echo \`${certbot} renew \
--pre-hook "date >> ${log}" \
--post-hook "nginx -t >> ${log} 2>&1; service nginx reload" \
>> ${log}\`