# buildboard

# Setup dev environment
Create a folder and check out following repositories:
```
\
  \buildboard                      <- git@github.com:buildboard/buildboard.git
  \tool-travis                     <- git@github.com:buildboard/tool-travis.git
  \tool-github                     <- git@github.com:buildboard/tool-github.git
  \tool-tp                         <- git@github.com:buildboard/tool-tp.git
  \buildboard-tool-bootstrap       <- git@github.com:buildboard/buildboard-tool-bootstrap.git
  \utils                           <- git@github.com:buildboard/utils.git
  \config-dev.json                 // Get these files 
  \config-prod.json                //    from developers
```

To start a tool:
```
cd tool-tp
npm start dev
```

To start buildboard:
```
cd buildboard
meteor --settings=..\config-dev.json
```
