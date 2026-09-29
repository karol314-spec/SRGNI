"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       FUNCIONES GENERALES
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function getStoredJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : fallback;

        } catch (error) {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {
            console.warn(
                "No fue posible guardar los datos:",
                error
            );
        }
    }

    function getSession() {
        return getStoredJSON(
            "srgniSession",
            null
        );
    }

    function setSession(username, role) {

        saveJSON("srgniSession", {
            username: username,
            role: role || "Usuario"
        });

    }

    function clearSession() {
        localStorage.removeItem("srgniSession");
    }


    /* =====================================================
       USUARIOS DE PRUEBA
    ===================================================== */

    const LOGIN_USERS = Object.freeze({

        admin: {
            password: "admin123",
            role: "Administrador"
        },

        docente: {
            password: "docente123",
            role: "Docente"
        },

        estudiante: {
            password: "estudiante123",
            role: "Estudiante"
        }

    });


    /*
     * Se prueban varios nombres habituales para que el login
     * funcione aunque los archivos del proyecto tengan un nombre
     * ligeramente diferente.
     */

    const DASHBOARD_CANDIDATES = {

        Administrador: [
            "dashboard.html",
            "admin.html",
            "administrador.html",
            "panel.html"
        ],

        Docente: [
            "docente.html",
            "teacher.html",
            "panel-docente.html",
            "dashboard-docente.html"
        ],

        Estudiante: [
            "estudiante.html",
            "student.html",
            "panel-estudiante.html",
            "dashboard-estudiante.html"
        ]

    };


    function redirectToDashboard(role) {

        const candidates =
            DASHBOARD_CANDIDATES[role] ||
            DASHBOARD_CANDIDATES.Administrador;

        /*
         * En un servidor local (Live Server, XAMPP, etc.)
         * intentamos encontrar el archivo que realmente existe.
         * Si el navegador no permite comprobarlo, usamos el primero.
         */

        (async function () {

            for (const page of candidates) {

                try {

                    const response = await fetch(
                        page,
                        {
                            method: "HEAD",
                            cache: "no-store"
                        }
                    );

                    if (response.ok) {

                        window.location.href = page;

                        return;
                    }

                } catch (error) {

                    /* Se intenta con el siguiente nombre. */

                }

            }

            window.location.href = candidates[0];

        })();

    }


    function getDisplayName() {

        const session = getSession();

        if (!session || !session.username) {
            return "Usuario";
        }

        return session.username
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(
                /\b\w/g,
                letter => letter.toUpperCase()
            );

    }


    /* =====================================================
       AÑO DEL FOOTER
    ===================================================== */

    const year = new Date().getFullYear();

    setText("current-year", year);
    setText("dashboardYear", year);


    /* =====================================================
       MENÚ PRINCIPAL DE LA PÁGINA DE INICIO
    ===================================================== */

    const menuCheckbox =
        document.getElementById("SRGNI");

    if (menuCheckbox) {

        $$(".navbar a").forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    menuCheckbox.checked = false;

                }
            );

        });

    }


    /* =====================================================
       NAVEGACIÓN SUAVE
    ===================================================== */

    function findElementByIdInsensitive(id) {

        const direct =
            document.getElementById(id);

        if (direct) {
            return direct;
        }

        const lowerId =
            String(id).toLowerCase();

        return $$('[id]').find(
            element =>
                element.id.toLowerCase() === lowerId
        ) || null;

    }


    function activateIndexTab(tabContent) {

        if (
            !tabContent ||
            !tabContent.classList.contains("tab-content")
        ) {
            return;
        }

        const contentClass =
            Array.from(tabContent.classList).find(
                className =>
                    /^pro[1-3]$/.test(className)
            );

        if (!contentClass) {
            return;
        }

        const tab =
            document.getElementById(contentClass);

        $$(".tab").forEach(
            item =>
                item.classList.remove("active")
        );

        $$(".tab-content").forEach(
            item =>
                item.classList.remove(
                    "visible",
                    "active"
                )
        );

        if (tab) {
            tab.classList.add("active");
        }

        tabContent.classList.add("visible");

    }


    $$('a[href^="#"]').forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const cleanId =
                    targetId.replace(/^#/, "");

                const target =
                    findElementByIdInsensitive(cleanId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                if (
                    target.classList.contains(
                        "tab-content"
                    )
                ) {

                    activateIndexTab(target);

                }

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                const menuCheckbox =
                    document.getElementById("SRGNI");

                if (menuCheckbox) {
                    menuCheckbox.checked = false;
                }

            }
        );

    });


    /* =====================================================
       BOTONES DE LA PÁGINA PRINCIPAL
    ===================================================== */

    $$(".btn-1").forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                const href =
                    button.getAttribute("href");

                if (
                    href &&
                    href !== "#"
                ) {
                    return;
                }

                event.preventDefault();

                const target =
                    document.getElementById(
                        "caracteristicas"
                    ) ||
                    document.getElementById(
                        "Beneficios"
                    ) ||
                    document.getElementById(
                        "contacto"
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    $$(".btn-2").forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                const href =
                    button.getAttribute("href");

                if (
                    href &&
                    href !== "#"
                ) {
                    return;
                }

                event.preventDefault();

                const target =
                    document.getElementById(
                        "Beneficios"
                    ) ||
                    document.getElementById(
                        "contacto"
                    ) ||
                    document.getElementById(
                        "caracteristicas"
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    /* =====================================================
       PESTAÑAS DE LA PÁGINA PRINCIPAL
    ===================================================== */

    $$(".tab").forEach(function (tab) {

        tab.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const tabId =
                    tab.id ||
                    tab.dataset.target ||
                    tab.dataset.tab ||
                    "";

                let target = null;

                if (tabId) {

                    target =
                        document.querySelector(
                            "." +
                            tabId +
                            ".tab-content"
                        ) ||
                        findElementByIdInsensitive(
                            tabId
                        );

                }

                if (!target) {

                    const index =
                        $$(".tab").indexOf(tab);

                    const contentTabs =
                        $$(".tab-content");

                    target =
                        contentTabs[index] || null;
                }

                if (!target) {
                    return;
                }

                $$(".tab").forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                $$(".tab-content").forEach(
                    item =>
                        item.classList.remove(
                            "visible",
                            "active"
                        )
                );

                tab.classList.add("active");

                target.classList.add("visible");

            }
        );

    });


    /* Mostrar la primera pestaña al cargar la página */

    const initialTab =
        document.querySelector(".tab.active") ||
        document.querySelector(".tab");

    if (initialTab) {
        initialTab.click();
    }


    /* =====================================================
       BOTONES "CARGAR MÁS"
    ===================================================== */

    $$(".load-more").forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const container =
                    button.closest("section") ||
                    button.parentElement;

                if (!container) {
                    return;
                }

                const hiddenItems =
                    $$(
                        ".box-1.hidden, .box-2.hidden, .box-3.hidden",
                        container
                    );

                if (hiddenItems.length) {

                    hiddenItems.forEach(
                        item =>
                            item.classList.remove(
                                "hidden"
                            )
                    );

                    button.textContent =
                        "Mostrar menos";

                } else {

                    const allItems =
                        $$(
                            ".box-1, .box-2, .box-3",
                            container
                        );

                    allItems
                        .slice(3)
                        .forEach(
                            item =>
                                item.classList.add(
                                    "hidden"
                                )
                        );

                    button.textContent =
                        "Cargar más";
                }

            }
        );

    });


    /* =====================================================
       FORMULARIO DE CONTACTO
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );

    if (
        contactForm &&
        !contactForm.dataset.srgniPrepared
    ) {

        contactForm.dataset.srgniPrepared =
            "true";

        /*
         * El HTML ya tiene su propia validación.
         * No agregamos otro submit para evitar
         * que se ejecute dos veces.
         */

    }


    /* =====================================================
       LOGIN Y REGISTRO
    ===================================================== */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA DEL LOGIN
    ===================================================== */

    const passwordInput =
        document.getElementById(
            "password"
        );

    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    if (
        togglePassword &&
        passwordInput &&
        !togglePassword.dataset.srgniPrepared
    ) {

        togglePassword.dataset.srgniPrepared =
            "true";


        togglePassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "🙈";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Ocultar contraseña"
                    );

                } else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "👁";

                    togglePassword.setAttribute(
                        "aria-label",
                        "Mostrar contraseña"
                    );

                }

            }
        );

    }


    /* =====================================================
       RECORDAR USUARIO
    ===================================================== */

    const rememberUser =
        document.getElementById(
            "rememberUser"
        );

    const usuarioInput =
        document.getElementById(
            "usuario"
        );


    if (
        rememberUser &&
        usuarioInput
    ) {

        const savedUser =
            localStorage.getItem(
                "srgniRememberUser"
            );


        if (savedUser) {

            usuarioInput.value =
                savedUser;

            rememberUser.checked =
                true;

        }

    }


    /* =====================================================
       INICIAR SESIÓN
    ===================================================== */

    if (
        loginForm &&
        !loginForm.dataset.srgniPrepared
    ) {

        loginForm.dataset.srgniPrepared =
            "true";


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const usernameInput =
                    document.getElementById(
                        "usuario"
                    );

                const passwordInput =
                    document.getElementById(
                        "password"
                    );

                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                const username =
                    usernameInput
                        ? usernameInput.value
                            .trim()
                            .toLowerCase()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /* =========================
                   VALIDAR CAMPOS
                ========================== */

                if (
                    !username ||
                    !password
                ) {

                    if (message) {

                        message.textContent =
                            "Por favor completa usuario y contraseña.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   VALIDAR CONTRASEÑA
                ========================== */

                if (
                    password.length < 6
                ) {

                    if (message) {

                        message.textContent =
                            "La contraseña debe tener mínimo 6 caracteres.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   BUSCAR USUARIO
                ========================== */

                const user =
                    LOGIN_USERS[username];


                if (!user) {

                    if (message) {

                        message.textContent =
                            "Usuario no registrado.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   VALIDAR CONTRASEÑA
                ========================== */

                if (
                    password !==
                    user.password
                ) {

                    if (message) {

                        message.textContent =
                            "Contraseña incorrecta.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }


                    if (passwordInput) {

                        passwordInput.focus();

                        passwordInput.select();

                    }


                    return;

                }


                /* =========================
                   RECORDAR USUARIO
                ========================== */

                const rememberCheckbox =
                    document.getElementById(
                        "rememberUser"
                    );


                if (
                    rememberCheckbox &&
                    rememberCheckbox.checked
                ) {

                    localStorage.setItem(
                        "srgniRememberUser",
                        username
                    );

                } else {

                    localStorage.removeItem(
                        "srgniRememberUser"
                    );

                }


                /* =========================
                   CREAR SESIÓN
                ========================== */

                setSession(
                    username,
                    user.role
                );


                /* =========================
                   MENSAJE DE ÉXITO
                ========================== */

                if (message) {

                    message.textContent =
                        "¡Inicio de sesión correcto! Entrando como " +
                        user.role +
                        "...";

                    message.style.color =
                        "#16a34a";

                    message.classList.add(
                        "show"
                    );

                }


                /* =========================
                   IR AL PANEL
                ========================== */

                redirectToDashboard(
                    user.role
                );

            }
        );

    }


    /* =====================================================
       REGISTRO
    ===================================================== */

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA DE REGISTRO
    ===================================================== */

    const registerPassword =
        document.getElementById(
            "passwordRegistro"
        );

    const toggleRegisterPassword =
        document.getElementById(
            "toggleRegisterPassword"
        );


    if (
        registerPassword &&
        toggleRegisterPassword &&
        !toggleRegisterPassword.dataset.srgniPrepared
    ) {

        toggleRegisterPassword.dataset.srgniPrepared =
            "true";


        toggleRegisterPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    registerPassword.type ===
                    "password"
                ) {

                    registerPassword.type =
                        "text";

                    toggleRegisterPassword.textContent =
                        "🙈";

                } else {

                    registerPassword.type =
                        "password";

                    toggleRegisterPassword.textContent =
                        "👁";

                }

            }
        );

    }


    /* =====================================================
       REGISTRO DE USUARIO
    ===================================================== */

    if (
        registerForm &&
        !registerForm.dataset.srgniPrepared
    ) {

        registerForm.dataset.srgniPrepared =
            "true";


        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nombre =
                    document.getElementById(
                        "nombre"
                    );

                const correo =
                    document.getElementById(
                        "correoRegistro"
                    );

                const tipo =
                    document.getElementById(
                        "tipoUsuario"
                    );

                const password =
                    document.getElementById(
                        "passwordRegistro"
                    );

                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    );

                const message =
                    document.getElementById(
                        "registerMessage"
                    );


                const nombreValue =
                    nombre
                        ? nombre.value.trim()
                        : "";

                const correoValue =
                    correo
                        ? correo.value.trim()
                        : "";

                const tipoValue =
                    tipo
                        ? tipo.value
                        : "";

                const passwordValue =
                    password
                        ? password.value
                        : "";

                const confirmPasswordValue =
                    confirmPassword
                        ? confirmPassword.value
                        : "";


                /* =========================
                   VALIDAR CAMPOS
                ========================== */

                if (
                    nombreValue === "" ||
                    correoValue === "" ||
                    tipoValue === "" ||
                    passwordValue === "" ||
                    confirmPasswordValue === ""
                ) {

                    if (message) {

                        message.textContent =
                            "Por favor completa todos los campos.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   VALIDAR CONTRASEÑA
                ========================== */

                if (
                    passwordValue.length < 6
                ) {

                    if (message) {

                        message.textContent =
                            "La contraseña debe tener mínimo 6 caracteres.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   CONFIRMAR CONTRASEÑA
                ========================== */

                if (
                    passwordValue !==
                    confirmPasswordValue
                ) {

                    if (message) {

                        message.textContent =
                            "Las contraseñas no coinciden.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   VALIDAR CORREO
                ========================== */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        correoValue
                    )
                ) {

                    if (message) {

                        message.textContent =
                            "Ingresa un correo electrónico válido.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                /* =========================
                   GUARDAR USUARIO REGISTRADO
                ========================== */

                const registeredUsers =
                    getStoredJSON(
                        "srgniRegisteredUsers",
                        []
                    );


                const alreadyExists =
                    registeredUsers.some(
                        function (user) {

                            return (
                                user.correo
                                    .toLowerCase() ===
                                correoValue.toLowerCase()
                            );

                        }
                    );


                if (alreadyExists) {

                    if (message) {

                        message.textContent =
                            "Ya existe una cuenta con este correo.";

                        message.style.color =
                            "#dc2626";

                        message.classList.add(
                            "show"
                        );

                    }

                    return;

                }


                registeredUsers.push({

                    nombre:
                        nombreValue,

                    correo:
                        correoValue,

                    tipo:
                        tipoValue,

                    password:
                        passwordValue

                });


                saveJSON(
                    "srgniRegisteredUsers",
                    registeredUsers
                );


                /* =========================
                   MENSAJE DE REGISTRO
                ========================== */

                if (message) {

                    message.textContent =
                        "¡Cuenta creada correctamente! Ahora puedes iniciar sesión.";

                    message.style.color =
                        "#16a34a";

                    message.classList.add(
                        "show"
                    );

                }


                /* =========================
                   LIMPIAR FORMULARIO
                ========================== */

                registerForm.reset();


                /* =========================
                   VOLVER AL LOGIN
                   SI ESTÁ EN LA MISMA PÁGINA
                ========================== */

                setTimeout(
                    function () {

                        const loginSection =
                            document.getElementById(
                                "loginSection"
                            );

                        const registerSection =
                            document.getElementById(
                                "registerSection"
                            );


                        if (
                            loginSection &&
                            registerSection
                        ) {

                            loginSection.style.display =
                                "block";

                            registerSection.style.display =
                                "none";


                            const loginTab =
                                document.getElementById(
                                    "loginTab"
                                );

                            const registerTab =
                                document.getElementById(
                                    "registerTab"
                                );


                            if (loginTab) {

                                loginTab.classList.add(
                                    "active"
                                );

                            }


                            if (registerTab) {

                                registerTab.classList.remove(
                                    "active"
                                );

                            }

                        }


                    },
                    1500
                );

            }
        );

    }


    /* =====================================================
       PESTAÑAS LOGIN / REGISTRO
       SOLO SE ACTIVAN SI EXISTEN EN EL HTML
    ===================================================== */

    const loginSection =
        document.getElementById(
            "loginSection"
        );

    const registerSection =
        document.getElementById(
            "registerSection"
        );

    const loginTab =
        document.getElementById(
            "loginTab"
        );

    const registerTab =
        document.getElementById(
            "registerTab"
        );

    const loginTab2 =
        document.getElementById(
            "loginTab2"
        );

    const registerTab2 =
        document.getElementById(
            "registerTab2"
        );

    const openRegister =
        document.getElementById(
            "openRegister"
        );

    const backToLogin =
        document.getElementById(
            "backToLogin"
        );


    function showLogin() {

        if (
            loginSection &&
            registerSection
        ) {

            loginSection.style.display =
                "block";

            registerSection.style.display =
                "none";

        }


        if (loginTab) {

            loginTab.classList.add(
                "active"
            );

        }


        if (registerTab) {

            registerTab.classList.remove(
                "active"
            );

        }


        if (loginTab2) {

            loginTab2.classList.add(
                "active"
            );

        }


        if (registerTab2) {

            registerTab2.classList.remove(
                "active"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function showRegister() {

        if (
            loginSection &&
            registerSection
        ) {

            loginSection.style.display =
                "none";

            registerSection.style.display =
                "block";

        }


        if (loginTab) {

            loginTab.classList.remove(
                "active"
            );

        }


        if (registerTab) {

            registerTab.classList.add(
                "active"
            );

        }


        if (loginTab2) {

            loginTab2.classList.remove(
                "active"
            );

        }


        if (registerTab2) {

            registerTab2.classList.add(
                "active"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (registerTab) {

        registerTab.addEventListener(
            "click",
            function (event) {

                if (
                    loginSection &&
                    registerSection
                ) {

                    event.preventDefault();

                    showRegister();

                }

            }
        );

    }


    if (openRegister) {

        openRegister.addEventListener(
            "click",
            function (event) {

                if (
                    loginSection &&
                    registerSection
                ) {

                    event.preventDefault();

                    showRegister();

                }

            }
        );

    }


    if (loginTab) {

        loginTab.addEventListener(
            "click",
            function (event) {

                if (
                    loginSection &&
                    registerSection
                ) {

                    event.preventDefault();

                    showLogin();

                }

            }
        );

    }


    if (loginTab2) {

        loginTab2.addEventListener(
            "click",
            function (event) {

                if (
                    loginSection &&
                    registerSection
                ) {

                    event.preventDefault();

                    showLogin();

                }

            }
        );

    }


    if (backToLogin) {

        backToLogin.addEventListener(
            "click",
            function (event) {

                if (
                    loginSection &&
                    registerSection
                ) {

                    event.preventDefault();

                    showLogin();

                }

            }
        );

    }
    /* =====================================================
       NAVEGACIÓN DE LOS PANELES
    ===================================================== */

    const sectionTitles = {

        "inicio-panel":
            "Inicio",

        "estudiantes":
            "Estudiantes",

        "docentes":
            "Docentes",

        "asignaturas":
            "Asignaturas",

        "calificaciones":
            "Calificaciones",

        "informes":
            "Informes",

        "notificaciones":
            "Notificaciones",

        "perfil":
            "Mi perfil",

        "student-home":
            "Inicio",

        "student-subjects":
            "Mis asignaturas",

        "student-grades":
            "Mis calificaciones",

        "student-average":
            "Mi promedio",

        "student-schedule":
            "Mi horario",

        "student-notifications":
            "Notificaciones",

        "student-profile":
            "Mi perfil",

        "teacher-home":
            "Inicio",

        "teacher-students":
            "Mis estudiantes",

        "teacher-subjects":
            "Mis asignaturas",

        "teacher-grades":
            "Registrar notas",

        "teacher-reports":
            "Informes",

        "teacher-notifications":
            "Notificaciones",

        "teacher-profile":
            "Mi perfil"

    };


    function showSection(
        sectionId,
        clickedButton
    ) {

        const target =
            document.getElementById(
                sectionId
            );

        if (!target) {
            return false;
        }

        const main =
            target.closest("main") ||
            document;

        const sections =
            $$(".dashboard-section", main);

        sections.forEach(
            function (section) {

                section.classList.remove(
                    "active"
                );

                section.style.display =
                    "none";

            }
        );


        target.classList.add(
            "active"
        );

        target.style.display =
            "";


        const navigationButtons =
            $$(
                ".sidebar-link[data-section], .nav-item[data-section]",
                main.parentElement || document
            );


        navigationButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        if (clickedButton) {

            clickedButton.classList.add(
                "active"
            );

        } else {

            const matching =
                $$(
                    '[data-section="' +
                    sectionId +
                    '"]'
                );

            matching.forEach(
                function (button) {

                    button.classList.add(
                        "active"
                    );

                }
            );

        }


        if (sectionTitles[sectionId]) {

            setText(
                "sectionTitle",
                sectionTitles[sectionId]
            );

            setText(
                "studentPageTitle",
                sectionTitles[sectionId]
            );

            setText(
                "teacherPageTitle",
                sectionTitles[sectionId]
            );

        }


        closeAllSidebars();

        return true;

    }


    /* =====================================================
       BOTONES data-section
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-section]"
                );

            if (!button) {
                return;
            }

            const sectionId =
                button.getAttribute(
                    "data-section"
                );

            if (!sectionId) {
                return;
            }

            const target =
                document.getElementById(
                    sectionId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            showSection(
                sectionId,
                button
            );


            const modal =
                button.closest(
                    ".dashboard-modal, .notification-modal"
                );

            if (modal) {

                modal.classList.remove(
                    "active"
                );

                modal.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       MENÚS MÓVILES
    ===================================================== */

    function toggleSidebar(
        sidebarId,
        overlayId
    ) {

        const sidebar =
            document.getElementById(
                sidebarId
            );

        const overlay =
            document.getElementById(
                overlayId
            );

        if (!sidebar) {
            return;
        }

        sidebar.classList.toggle(
            "open"
        );

        sidebar.classList.toggle(
            "active"
        );

        if (overlay) {

            overlay.classList.toggle(
                "active"
            );

        }

    }


    function closeSidebar(
        sidebarId,
        overlayId
    ) {

        const sidebar =
            document.getElementById(
                sidebarId
            );

        const overlay =
            document.getElementById(
                overlayId
            );

        if (sidebar) {

            sidebar.classList.remove(
                "open"
            );

            sidebar.classList.remove(
                "active"
            );

        }

        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }

    }


    function closeAllSidebars() {

        closeSidebar(
            "dashboardSidebar",
            "sidebarOverlay"
        );

        closeSidebar(
            "sidebar",
            "sidebarOverlay"
        );

    }


    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {

                toggleSidebar(
                    "dashboardSidebar",
                    "sidebarOverlay"
                );

            }
        );

    }


    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                toggleSidebar(
                    "sidebar",
                    "sidebarOverlay"
                );

            }
        );

    }


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeAllSidebars
        );

    }


    /* =====================================================
       MODALES
    ===================================================== */

    function openModal(id) {

        const modal =
            document.getElementById(id);

        if (!modal) {
            return;
        }

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }


    function closeModal(id) {

        const modal =
            document.getElementById(id);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    /* =====================================================
       ADMINISTRADOR - NOTIFICACIONES
    ===================================================== */

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                openModal(
                    "notificationModal"
                );

            }
        );

    }


    const closeNotificationModal =
        document.getElementById(
            "closeNotificationModal"
        );


    if (closeNotificationModal) {

        closeNotificationModal.addEventListener(
            "click",
            function () {

                closeModal(
                    "notificationModal"
                );

            }
        );

    }


    /* =====================================================
       ESTUDIANTE - NOTIFICACIONES
    ===================================================== */

    const studentNotificationButton =
        document.getElementById(
            "studentNotificationButton"
        );


    if (studentNotificationButton) {

        studentNotificationButton.addEventListener(
            "click",
            function () {

                openModal(
                    "studentNotificationModal"
                );

            }
        );

    }


    const closeStudentModal =
        document.getElementById(
            "closeStudentModal"
        );


    if (closeStudentModal) {

        closeStudentModal.addEventListener(
            "click",
            function () {

                closeModal(
                    "studentNotificationModal"
                );

            }
        );

    }


    /* =====================================================
       DOCENTE - NOTIFICACIONES
    ===================================================== */

    const teacherNotificationButton =
        document.getElementById(
            "teacherNotificationButton"
        );


    if (teacherNotificationButton) {

        teacherNotificationButton.addEventListener(
            "click",
            function () {

                openModal(
                    "teacherNotificationModal"
                );

            }
        );

    }


    const closeTeacherModal =
        document.getElementById(
            "closeTeacherModal"
        );


    if (closeTeacherModal) {

        closeTeacherModal.addEventListener(
            "click",
            function () {

                closeModal(
                    "teacherNotificationModal"
                );

            }
        );

    }


    /* =====================================================
       CERRAR MODALES AL HACER CLICK AFUERA
    ===================================================== */

    $$(".dashboard-modal, .notification-modal")
        .forEach(
            function (modal) {

                modal.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            modal
                        ) {

                            modal.classList.remove(
                                "active"
                            );

                            modal.style.display =
                                "none";

                        }

                    }
                );

            }
        );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            $$(".dashboard-modal, .notification-modal")
                .forEach(
                    function (modal) {

                        modal.classList.remove(
                            "active"
                        );

                        modal.style.display =
                            "none";

                    }
                );

            closeAllSidebars();

        }
    );


    /* =====================================================
       NOTIFICACIONES
    ===================================================== */

    function markNotificationsAsRead(
        sectionId,
        badgeSelector,
        buttonId
    ) {

        const section =
            document.getElementById(
                sectionId
            );


        if (section) {

            $$(".unread", section)
                .forEach(
                    function (item) {

                        item.classList.remove(
                            "unread"
                        );

                    }
                );

        }


        if (badgeSelector) {

            $$(badgeSelector)
                .forEach(
                    function (badge) {

                        badge.textContent =
                            "0";

                        badge.style.display =
                            "none";

                    }
                );

        }


        const button =
            document.getElementById(
                buttonId
            );


        if (button) {

            button.textContent =
                "✓ Notificaciones leídas";

            button.disabled =
                true;

        }

    }


    const markNotifications =
        document.getElementById(
            "markNotifications"
        );


    if (markNotifications) {

        markNotifications.addEventListener(
            "click",
            function () {

                markNotificationsAsRead(
                    "notificaciones",
                    "#notificationBadge, #headerNotificationBadge",
                    "markNotifications"
                );

            }
        );

    }


    const markStudentNotifications =
        document.getElementById(
            "markStudentNotifications"
        );


    if (markStudentNotifications) {

        markStudentNotifications.addEventListener(
            "click",
            function () {

                markNotificationsAsRead(
                    "student-notifications",
                    ".notification-badge, #studentNotificationButton span",
                    "markStudentNotifications"
                );

            }
        );

    }


    const markTeacherNotifications =
        document.getElementById(
            "markTeacherNotifications"
        );


    if (markTeacherNotifications) {

        markTeacherNotifications.addEventListener(
            "click",
            function () {

                markNotificationsAsRead(
                    "teacher-notifications",
                    ".notification-badge, #teacherNotificationButton span",
                    "markTeacherNotifications"
                );

            }
        );

    }


    /* =====================================================
       DATOS DE SESIÓN EN LOS PANELES
    ===================================================== */

    const displayName =
        getDisplayName();

    const session =
        getSession();


    if (session) {

        setText(
            "sidebarUserName",
            displayName
        );

        setText(
            "headerUserName",
            displayName
        );

        setText(
            "studentWelcomeName",
            displayName
        );

        setText(
            "studentHeaderName",
            displayName
        );

        setText(
            "studentProfileName",
            displayName
        );

        setText(
            "teacherWelcomeName",
            displayName
        );

        setText(
            "teacherHeaderName",
            displayName
        );

        setText(
            "teacherProfileName",
            displayName
        );


        const initials =
            displayName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map(
                    word =>
                        word
                            .charAt(0)
                            .toUpperCase()
                )
                .join("") || "U";


        setText(
            "sidebarAvatar",
            initials
        );

        setText(
            "headerAvatar",
            initials
        );

        setText(
            "studentAvatar",
            initials
        );

        setText(
            "teacherAvatar",
            initials
        );

    }


    /* =====================================================
       CERRAR SESIÓN
    ===================================================== */

    function logout() {

        clearSession();

        try {

            window.location.href =
                "index.html";

        } catch (error) {

            window.history.back();

        }

    }


    [
        "logoutButton",
        "studentLogout",
        "teacherLogout"
    ].forEach(
        function (id) {

            const button =
                document.getElementById(id);

            if (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        const confirmed =
                            window.confirm(
                                "¿Seguro que deseas cerrar sesión?"
                            );

                        if (confirmed) {
                            logout();
                        }

                    }
                );

            }

        }
    );


    /* =====================================================
       ADMINISTRADOR - ACTUALIZAR DATOS
    ===================================================== */

    function updateAdminCounters() {

        const studentsTable =
            document.getElementById(
                "studentsTable"
            );


        const studentRows =
            studentsTable
                ? $$(
                    "tbody tr",
                    studentsTable
                )
                : [];


        const grades =
            getStoredJSON(
                "srgniGrades",
                []
            );


        if (studentRows.length) {

            setText(
                "studentsCount",
                studentRows.length
            );

        }


        if (grades.length) {

            setText(
                "gradesCount",
                grades.length
            );

        }

    }


    const refreshData =
        document.getElementById(
            "refreshData"
        );


    if (refreshData) {

        refreshData.addEventListener(
            "click",
            function () {

                updateAdminCounters();

                refreshData.textContent =
                    "✓ Datos actualizados";

                setTimeout(
                    function () {

                        refreshData.textContent =
                            "Actualizar";

                    },
                    1800
                );

            }
        );

    }


    updateAdminCounters();


    /* =====================================================
       DOCENTE - BUSCAR ESTUDIANTES
    ===================================================== */

    const studentSearch =
        document.getElementById(
            "studentSearch"
        );


    const studentsTable =
        document.getElementById(
            "studentsTable"
        );


    if (
        studentSearch &&
        studentsTable
    ) {

        studentSearch.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .toLowerCase()
                        .trim();


                $$(
                    "tbody tr",
                    studentsTable
                ).forEach(
                    function (row) {

                        const text =
                            row.textContent
                                .toLowerCase();

                        row.style.display =
                            text.includes(
                                search
                            )
                                ? ""
                                : "none";

                    }
                );

            }
        );

    }


    /* =====================================================
       DOCENTE - VER ESTUDIANTE
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".table-action"
                );


            if (!button) {
                return;
            }


            const row =
                button.closest("tr");


            if (!row) {
                return;
            }


            const cells =
                $$(
                    "td",
                    row
                );


            const name =
                cells[0]
                    ? cells[0]
                        .textContent
                        .trim()
                    : "Estudiante";


            const documentNumber =
                cells[1]
                    ? cells[1]
                        .textContent
                        .trim()
                    : "No disponible";


            const program =
                cells[2]
                    ? cells[2]
                        .textContent
                        .trim()
                    : "No disponible";


            const status =
                cells[3]
                    ? cells[3]
                        .textContent
                        .trim()
                    : "No disponible";


            window.alert(
                "Información del estudiante\n\n" +
                "Nombre: " +
                name +
                "\n" +
                "Documento: " +
                documentNumber +
                "\n" +
                "Programa: " +
                program +
                "\n" +
                "Estado: " +
                status
            );

        }
    );


    /* =====================================================
       DOCENTE - AGREGAR ESTUDIANTE
    ===================================================== */

    const addStudentBtn =
        document.getElementById(
            "addStudentBtn"
        );


    if (
        addStudentBtn &&
        studentsTable
    ) {

        addStudentBtn.addEventListener(
            "click",
            function () {

                const name =
                    window.prompt(
                        "Nombre completo del estudiante:"
                    );


                if (
                    !name ||
                    !name.trim()
                ) {
                    return;
                }


                const documentNumber =
                    window.prompt(
                        "Número de documento:"
                    );


                if (
                    !documentNumber ||
                    !documentNumber.trim()
                ) {
                    return;
                }


                const program =
                    window.prompt(
                        "Programa:",
                        "ADSO"
                    ) || "ADSO";


                const tbody =
                    $("tbody", studentsTable);


                if (!tbody) {
                    return;
                }


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>${escapeHTML(name.trim())}</td>
                    <td>${escapeHTML(documentNumber.trim())}</td>
                    <td>${escapeHTML(program.trim())}</td>
                    <td>
                        <span class="status-active">
                            Activo
                        </span>
                    </td>
                    <td>
                        <button
                            class="table-action"
                            type="button">
                            Ver
                        </button>
                    </td>
                `;


                tbody.appendChild(row);


                updateAdminCounters();


                addStudentToGradeSelector(
                    name.trim()
                );


                window.alert(
                    "Estudiante agregado correctamente."
                );

            }
        );

    }


    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       DOCENTE - SELECTOR DE ESTUDIANTES
    ===================================================== */

    function addStudentToGradeSelector(
        name
    ) {

        const select =
            document.getElementById(
                "gradeStudent"
            );


        if (
            !select ||
            !name
        ) {
            return;
        }


        const exists =
            Array.from(
                select.options
            ).some(
                option =>
                    option.value
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (exists) {
            return;
        }


        const option =
            document.createElement(
                "option"
            );


        option.value =
            name;


        option.textContent =
            name;


        select.appendChild(
            option
        );

    }


    /* =====================================================
       DOCENTE - GUARDAR CALIFICACIÓN
    ===================================================== */

    const saveGradeBtn =
        document.getElementById(
            "saveGradeBtn"
        );


    if (saveGradeBtn) {

        saveGradeBtn.addEventListener(
            "click",
            function () {

                const student =
                    document.getElementById(
                        "gradeStudent"
                    );


                const subject =
                    document.getElementById(
                        "gradeSubject"
                    );


                const activity =
                    document.getElementById(
                        "gradeActivity"
                    );


                const value =
                    document.getElementById(
                        "gradeValue"
                    );


                const message =
                    document.getElementById(
                        "gradeMessage"
                    );


                const studentValue =
                    student
                        ? student.value.trim()
                        : "";


                const subjectValue =
                    subject
                        ? subject.value.trim()
                        : "";


                const activityValue =
                    activity
                        ? activity.value.trim()
                        : "";


                const gradeValue =
                    value
                        ? Number(value.value)
                        : NaN;


                if (
                    !studentValue ||
                    !subjectValue ||
                    !activityValue ||
                    Number.isNaN(
                        gradeValue
                    )
                ) {

                    if (message) {

                        message.textContent =
                            "Completa todos los campos.";

                        message.classList.remove(
                            "success"
                        );

                        message.classList.add(
                            "error"
                        );

                    }

                    return;
                }


                if (
                    gradeValue < 0 ||
                    gradeValue > 5
                ) {

                    if (message) {

                        message.textContent =
                            "La calificación debe estar entre 0 y 5.";

                        message.classList.remove(
                            "success"
                        );

                        message.classList.add(
                            "error"
                        );

                    }

                    return;
                }


                const grades =
                    getStoredJSON(
                        "srgniGrades",
                        []
                    );


                grades.push({

                    student:
                        studentValue,

                    subject:
                        subjectValue,

                    activity:
                        activityValue,

                    value:
                        Number(
                            gradeValue.toFixed(1)
                        ),

                    date:
                        new Date()
                            .toLocaleDateString(
                                "es-CO"
                            )

                });


                saveJSON(
                    "srgniGrades",
                    grades
                );


                if (message) {

                    message.textContent =
                        "✓ Calificación guardada correctamente.";

                    message.classList.remove(
                        "error"
                    );

                    message.classList.add(
                        "success"
                    );

                }


                if (activity) {
                    activity.value = "";
                }


                if (value) {
                    value.value = "";
                }


                updateAdminCounters();

            }
        );

    }


    /* =====================================================
       DOCENTE - INFORMES
    ===================================================== */

    $$(".small-btn").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".report-card"
                        );


                    if (!card) {
                        return;
                    }


                    const titleElement =
                        $("h3", card);


                    const title =
                        titleElement
                            ? titleElement
                                .textContent
                                .trim()
                            : "Informe académico";


                    const grades =
                        getStoredJSON(
                            "srgniGrades",
                            []
                        );


                    const reportText =
                        "Informe: " +
                        title +
                        "\n\n" +
                        "Calificaciones registradas: " +
                        grades.length +
                        "\n" +
                        "Fecha de generación: " +
                        new Date()
                            .toLocaleDateString(
                                "es-CO"
                            );


                    window.alert(
                        reportText
                    );

                }
            );

        }
    );


    /* =====================================================
       BOTONES DEL PANEL ADMINISTRADOR
    ===================================================== */

    $$(".management-card button")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const text =
                            button.textContent
                                .trim()
                                .toLowerCase();


                        if (
                            text.includes(
                                "registrar docente"
                            ) ||
                            text.includes(
                                "ver docentes"
                            )
                        ) {

                            const target =
                                document.getElementById(
                                    "docentes"
                                );


                            if (target) {

                                showSection(
                                    "docentes"
                                );

                            }

                            return;
                        }


                        if (
                            text.includes(
                                "crear asignatura"
                            ) ||
                            text.includes(
                                "ver asignaturas"
                            )
                        ) {

                            const target =
                                document.getElementById(
                                    "asignaturas"
                                );


                            if (target) {

                                showSection(
                                    "asignaturas"
                                );

                            }

                            return;
                        }


                        if (
                            text.includes(
                                "nueva calificación"
                            )
                        ) {

                            const target =
                                document.getElementById(
                                    "calificaciones"
                                );


                            if (target) {

                                showSection(
                                    "calificaciones"
                                );

                            }

                        }

                    }
                );

            }
        );


    /* =====================================================
       BOTÓN VOLVER ARRIBA
    ===================================================== */

    const backToTop =
        document.getElementById(
            "back-to-top"
        );


    if (backToTop) {

        backToTop.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


        window.addEventListener(
            "scroll",
            function () {

                backToTop.classList.toggle(
                    "show",
                    window.scrollY > 400
                );

            }
        );

    }


    /* =====================================================
       EFECTO DEL HEADER AL HACER SCROLL
    ===================================================== */

    const mainHeader =
        document.querySelector(
            ".SRGNI"
        );


    if (mainHeader) {

        window.addEventListener(
            "scroll",
            function () {

                mainHeader.classList.toggle(
                    "scrolled",
                    window.scrollY > 30
                );

            }
        );

    }


    /* =====================================================
       INICIALIZAR SECCIONES
    ===================================================== */

    $$(".dashboard-section")
        .forEach(
            function (section) {

                const main =
                    section.closest(
                        "main"
                    ) ||
                    document;


                const sections =
                    $$(".dashboard-section", main);


                if (
                    !sections.some(
                        item =>
                            item.classList.contains(
                                "active"
                            )
                    )
                ) {

                    if (sections[0]) {

                        sections[0]
                            .classList.add(
                                "active"
                            );

                    }

                }

            }
        );


    /* =====================================================
       FUNCIONES DISPONIBLES DESDE OTROS SCRIPTS
    ===================================================== */

    window.SRGNI = {

        showSection:
            showSection,

        openModal:
            openModal,

        closeModal:
            closeModal,

        getSession:
            getSession,

        clearSession:
            clearSession

    };

});