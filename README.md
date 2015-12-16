# buildboard

# Setup dev environment
Create a folder and check out following repositories:
```
\
  \buildboard           <- git@github.com:buildboard/buildboard.git
  \citool-travis        <- git@github.com:buildboard/citool-travis.git
  \codetool-github      <- git@github.com:buildboard/codetool-github.git
  \pmtool-tp            <- git@github.com:buildboard/pmtool-tp.git
  \tool-bootstrap       <- git@github.com:buildboard/tool-bootstrup.git
  \utils                <- git@github.com:buildboard/utils.git
  \config-dev.json      // Get these files 
  \config-prod.json     //    from developers
```

To start a tool:
```
cd pmtool-tp
env SECRET_KEY=your_shared_secret npm start dev
```

To start buildboard:
```
cd buildboard
meteor --settings=..\config-dev.json
```
