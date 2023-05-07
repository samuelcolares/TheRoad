const Main = {
    init: function () {
        this.cacheSelectors();
        this.bindEvents();
        setInterval(this.Events.changeVideo.bind(this), 10000)
    },

    cacheSelectors: function () {
        this.logo = document.querySelector('.logo h1')

        this.navigationBtn = document.querySelectorAll('.navigation-button')

        this.showVideosBtn = document.querySelector('.show-video')
        this.videos = document.querySelectorAll('.bg-video')
    },
    bindEvents: function () {
        this.logo.innerHTML = this.Events.textLogo('theroad')

        this.navigationBtn.forEach(button => {
            button.addEventListener('click', () =>
                button.parentElement.parentElement.classList.toggle('showBack')
            )
        })

        this.showVideosBtn.addEventListener('click', () => {
            this.showVideosBtn.parentElement.classList.toggle('show')
            if (this.showVideosBtn.textContent === 'Show Background') {
                this.showVideosBtn.textContent = 'Hide Background'
            } else {
                this.showVideosBtn.textContent = 'Show Background'
            }
        })


    },
    count: 0,
    Events: {
        textLogo: function (text) {
            return text.split('').map((letter, idx) => `<span class="center" style="animation-delay: ${((idx + 1) * 0.1).toFixed(1)}s">${letter}</span>`).join('')
        },

        changeVideo: function () {
            this.videos.forEach((video, idx) => {
                if (idx === this.count) {
                    video.play()
                    video.classList.add('curr')
                } else {
                    video.pause()
                    video.classList.remove('curr')
                }
            })
            this.count++
            if (this.count > this.videos.length - 1) {
                this.count = 0
            }
        }
    },
}

Main.init()

const formValidate = {
    init: function () {
        this.cacheSelectors();
        this.bindEvents();
    },

    cacheSelectors: function () {
        this.form = document.forms[0]
        this.formInputs = [this.form.name, this.form.email, this.form.phone, this.form.textarea]
    },

    bindEvents: function () {
        this.form.onsubmit = e => e.preventDefault()

        this.form.addEventListener('input', this.Events.validation.bind(this))
    },

    Events: {
        validation: function () {
            const [name, email, phone, textarea] = this.formInputs
            let erro = false
            this.formInputs.forEach(input => {
                if (input.value.length > 0) {
                    input.classList.add('hasData')
                } else {
                    input.classList.remove('hasData')
                }
            })

            const nameRegex = /[\d\W]/
            const numberRegex = /[\d]/g
            const emailRegex = /^([^@]+)@([^@.]+)\.com$/

            if (nameRegex.test(name.value)) {
                name.classList.add('erro')
                erro = true
            } else {
                name.classList.remove('erro')
            }

            if (emailRegex.test(email.value)) {
                email.classList.remove('erro')
            } else {
                erro = true
                email.classList.add('erro')
            }

            if (numberRegex.test(phone.value) && phone.value.length > 8) {
                phone.classList.remove('erro')
            } else {
                erro = true
                phone.classList.add('erro')
            }

            if (textarea.value.split(' ').length < 10) {
                erro = true
                textarea.classList.add('erro')
            } else {
                textarea.classList.remove('erro')
            }

            if (!erro) {
                this.form.submitBtn.disabled = false
            } else {
                this.form.submitBtn.disabled = true
            }
        }
    },
}

formValidate.init()

const NavigationLinks = {
    init: function () {
        this.cacheSelectors();
        this.bindEvents();

    },

    cacheSelectors: function () {
        this.menuBTN = document.getElementById('toggle')
        this.container = document.querySelector(`.container`)
        this.navLinks = document.querySelectorAll(`.nav-link`)
        this.footerLinks = document.querySelectorAll('.footer-link')
        this.sections = document.querySelectorAll('section')
    },

    colors: ["#6495ed", "#7fffd4", "#ffa07a", "#f08080", "#afeeee"],

    bindEvents: function () {
        this.menuBTN.addEventListener('click', () => {
            this.menuBTN.classList.toggle('menuOpen')
            this.container.classList.toggle('xxx')
            this.Events.reset.bind(this)()
        })

        this.navLinks.forEach((link, idx) => {
            const [tours, stories, contact] = this.sections
            link.style.backgroundColor = `${this.colors[idx]}`

            link.addEventListener(`click`, () => {
                idx === 0 ? this.Events.scrollWhere.bind(this)(0)
                    : idx === 1 ? this.Events.scrollWhere.bind(this)(tours.offsetTop)
                        : idx === 3 ? this.Events.scrollWhere.bind(this)(stories.offsetTop)
                            : idx === 4 ? this.Events.scrollWhere.bind(this)(contact.offsetTop)
                                : this.Events.soon(this.navLinks[idx])
            })
        })

        this.footerLinks.forEach((link, idx) => {
            const [tours, stories, contact] = this.sections

            link.addEventListener(`click`, (e) => {
                e.preventDefault()
                idx === 0 ? this.Events.scrollWhere.bind(this)(0)
                    : idx === 1 ? this.Events.scrollWhere.bind(this)(tours.offsetTop)
                        : idx === 3 ? this.Events.scrollWhere.bind(this)(stories.offsetTop)
                            : idx === 4 ? this.Events.scrollWhere.bind(this)(contact.offsetTop)
                                : this.Events.soon(this.footerLinks[idx])
            })
        })

        window.addEventListener('scroll', this.Events.accessibilityBTN.bind(this))
    },

    Events: {
        reset: function () {
            if (this.container.classList.contains(`xxx`)) {
                this.navLinks.forEach((link, idx) => {
                    link.style.transition = `opacity .4s, transform 1s ${(idx + 1) * 0.2 + 0.2}s`
                })
            } else {
                this.navLinks.forEach((link) => {
                    link.style.transition = `opacity .4s`
                })
            }
        },
        scrollWhere: function (here) {
            window.scrollTo({
                top: here,
                behavior: `smooth`
            })
            this.Events.removeMenuOpen.bind(this)()
        },
        removeMenuOpen: function () {
            this.navLinks.forEach((link) => {
                link.style.transition = `opacity .4s`
            })
            setTimeout(() => {
                this.menuBTN.classList.remove('menuOpen')
                this.container.classList.remove('xxx')
            }, 100)
        },
        soon: function (link) {
            link.textContent = 'Soon...'
            setTimeout(() => {
                link.textContent = 'About Us'
            }, 1500)
        },
        accessibilityBTN: function() {
            const [tours, stories] = this.sections
            window.scrollY > tours.offsetTop - 74 &&
                window.scrollY < stories.offsetTop - 74
                ? this.menuBTN.classList.add('accessibility')
                : this.menuBTN.classList.remove('accessibility')
        }
    },
}

NavigationLinks.init()

