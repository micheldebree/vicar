#!/bin/bash
docker run -p 9000:9000 -p 35730:35730 -v $PWD:$PWD micheldebree/vicar-dev /bin/bash -c "cd $PWD; grunt serve"
