## Installation

See Lab 2 (https://cs396-web-dev.github.io/spring2022/assignments/lab02) for instructions on how to:

1. set up your virtual environment,
2. install the dependencies,
3. set up the Flask environment variables, and 
4. run your Flask app

## Instructions

* [HW1](https://cs396-web-dev.github.io/spring2022/assignments/hw01)
* [HW2](https://cs396-web-dev.github.io/spring2022/assignments/hw02)
* [HW3](https://cs396-web-dev.github.io/spring2022/assignments/hw03)

---

## HW1 Outline
```
<body>
    <nav id="navigation-bar">
    </nav>

    <section id="main">
        <div class="left-panel">
            <div class="stories">
            </div>
            <div class="posts">
            </div>
        </div>

        <div class="right-panel">
        </div>
    </section>
</body>
```

--- 

## HW 2

### Organize files
```
photo-app
├── .git                        # your local git repo (that you created for HW1)
├── Procfile
├── README.md
├── app.py
├── fake_data.py
├── requirements.txt
├── static
│   ├── starter_style.css
│   └── style.css               # your CSS file from HW1
└── templates
    ├── index.html              # your HTML file from HW1
    └── starter_template.html
```

### Set Up Virtual Environment
```
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt    # install dependencies

# set environment variables (you just have to do this once per session)
export FLASK_APP=app.py     
export FLASK_ENV=development

# then run flask (type Ctrl+C to quit)
flask run
```

### Finished File Tree
```
photo-app
├── Procfile
├── README.md
├── app.py
├── fake_data.py
├── other-files                 # create an other-files folder for your submission
|   ├── writeup.txt             # accessibility write-up
|   ├── GitHub-Screenshot.png   # screenshot of your git repo
│   └── Wave-Screenshot.png     # screenshot of your accessibility report
├── requirements.txt
├── static
|   ├── starter_style.css
│   └── style.css
└── templates
    ├── includes
    │   ├── navbar.html
    │   ├── cards.html
    │   ├── stories.html
    │   └── suggestions.html
    ├── index.html
    └── starter_template.html
```