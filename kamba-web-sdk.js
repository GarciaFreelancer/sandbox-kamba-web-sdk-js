let setComponentAttributes = (e, p, f, a, callback) => {

    var cl = (typeof e === 'object') ? e : document.querySelector(e);
    if (cl !== undefined && (p !== undefined || p !== null) && p in cl) {
        if (typeof cl[p] === 'function') {
            for (var prs in a) {
                if (typeof a[prs] === 'object') {
                    cl[p](a[prs]);
                } else {
                    cl[p](prs, a[prs]);
                }
            }
        } else {
            if (f in cl[p] && typeof cl[p][f] === 'function') {
                for (var prs in a) {
                    cl[p][f](prs, a[prs]);
                }
            }
        }
    } else if (p === undefined || p === null) {
        for (var prs in a) {
            cl[prs] = a[prs];
        }
    }
    if (typeof callback === 'function') {
        callback(cl);
    }
    return cl;
};

let getComponents = (e, evt, callback) => {
    let el = (typeof e === 'object') ? e : document.querySelector(e);
    if (el !== undefined || el !== null) {
        if (evt !== undefined || evt !== null) {
            el.addEventListener(evt, callback);
        }
    }
    return el;
};

let kambaComponentCreator = (e, p, f, a, callback) => {
    let t;
    if (Array.isArray(e)) {
        t = e.forEach((obj) => {
            setComponentAttributes(obj, p, f, a);
        });
    } else {
        t = setComponentAttributes(e, p, f, a);
    }
    if (typeof callback === 'function') {
        callback(t);
    }
    return t;
};


let kambaObjectCreator = (object, callback) => {
    let el = document.createElement(object);
    if (typeof callback === 'function') {
        return callback(el);
    }
    return el;
};

let ready = (fn) => {
    (document.readyState !== 'loading') ? fn(): getComponents(document, 'DOMContentLoaded', fn);
};


ready(function() {
    kambaObjectCreator('img', (img) => {
        setComponentAttributes(img, 'setAttribute', undefined, {
            'src': 'https://image.ibb.co/mFZUTz/Pay_Logo_kamba.png',
            'class': 'classImgButtonKamba'
        }, (img) => {
            setComponentAttributes('.btnOpenWidgetKamba', undefined, undefined, {
                'innerHTML': 'Pagar com o Kamba'
            }, (btnOpenWidgetKamba) => {
                setComponentAttributes(btnOpenWidgetKamba, 'appendChild', undefined, {
                    0: img
                });
            });
        });
    });


    kambaComponentCreator('.btnOpenWidgetKamba', 'style', 'setProperty', {
        'background-image': 'linear-gradient(to left, #00FFB3, #00ff5f)',
        'border': 'none',
        'padding': '0.5rem',
        'cursor': 'pointer',
        'font-size': '1rem',
        'border-radius': '0.3rem',
        'font-family': 'Montserrat,"sans-serif"',
        'display': 'flex',
        'justify-content': 'center',
        'box-sizing': 'border-box'
    });

    kambaComponentCreator('.classImgButtonKamba', 'style', 'setProperty', { 'width': '25%', 'margin-left': '0.5rem' });
});

(function() {
    (function bootstrap() {
        'use strict';

        window.KAMBA = window.KAMBA || {};

        window.kamba = (body, config) => {
            ready(function() {
                //Send - Post request
                let url = (config.environment == 'sandbox') ? "https://sandbox.usekamba.com/v1/checkouts/" : "https://api.usekamba.com/v1/checkouts/";

                fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': 'Token ' + config.api_key
                        },
                        body: body //instanceof object always or it will return an error

                    }).then(function(response) {
                        if (response.ok) {

                            response.json().then(data => {
                                // i suggest the change because all the currence by default use decimal place and it's represented by float
                                var inicialAmount = new Number(data.inicialAmount);
                                var totalAmount = new Number(data.totalAmount);

                                var dateConvert = new Date(data.created_at);
                                var newDateConvert = [dateConvert.getDate(), dateConvert.getMonth(), dateConvert.getFullYear()].join('/') + ' às ' + [dateConvert.getHours(), dateConvert.getMinutes(), dateConvert.getSeconds()].join(':');

                                var convertQrCode = data.qr_code.html;

                                console.log(convertQrCode);

                                var mainKambaModalContainer = document.createElement("main");

                                //Modal Container
                                var kambaModalContainer = document.getElementsByTagName("body")[0].appendChild(mainKambaModalContainer);

                                kambaModalContainer = kambaComponentCreator(kambaModalContainer, 'classList', 'add', { 'kambaModalContainer': 'kambaModalContainer' });
                                kambaModalContainer = kambaComponentCreator('.kambaModalContainer', 'style', 'setProperty', {
                                    width: '100%',
                                    height: '100%',
                                    'background-color': 'rgba(0,0,0,.25)',
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    'z-index': '1000000000000000000000',
                                    'display': 'flex',
                                    'justify-content': 'center',
                                    'align-items': 'center',
                                    'box-sizing': 'border-box',
                                    'padding-right': '1rem',
                                    'overflow': 'auto'
                                });

                                //Template
                                const kambaWidget = `
                    <div class="kambaModalWidget">
                        <header class="checkoutHeader">

                            <div class="securityPay">
                                <div class="textSecurityPay"><img src="https://image.ibb.co/bxv8MK/icons8_lock_kamba.png" class="lock"> <span class="ps"> Pagamento seguro</span></div>
                            </div>
                        </header>
                        <section>
                            <article class="headerWidget">
                                <div class="qrPart">
                                    <div class="detailQr">
                                        <div class="divSvg">
                                            <svg viewBox="0 0 625 625" preserveAspectRatio="xMidYMid meet" class="imgQr">
                                                    ${data.qr_code.svg}
                                            </svg>
                                             <div class="textValidate">
                                                Válido até ${newDateConvert}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="partDetailPay">
                                    <div class="payDetail">
                                        <ul class="listProprietyProduct">
                                            <li class="nameProduct"><b> ${data.notes} </b></li>
                                            <li class="priceProduct"><b>${inicialAmount.toLocaleString('pt-ao', {style: 'currency', currency: config.currency})} </b></li>
                                        </ul>
                                        <ul class="listTotal">
                                            <li class="descriptionTotal"><b>TOTAL</b></li>
                                            <li class="priceTotal"><b>${totalAmount.toLocaleString('pt-ao', {style: 'currency', currency: config.currency})} </b></li>
                                        </ul>
                                    </div>
                                </div>
                            </article>
                            <article>
                                <div  class="descriptionKamba">
                                    <div class="helpKamba">
                                        <div class="optionHelpKamba1">
                                            - Abra o App em seu telefone e escaneie o código
                                        </div>
                                        <div class="optionHelpKamba2">
                                            - Como faço para digitalizar o código?
                                        </div>
                                        <div class="optionHelpKamba3">- Não tem uma conta Kamba? <a href="#" class="appLinkKamba"> Baixe o App</a>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <footer class="footerKamba">
                                <div class="descritionKambaMerchant">Pagar <b> ${data.merchant.business_name} </b>
                                </div>
                                <div class="btnCloseWidgetKamba">
                                    Fechar
                                </div>
                            </footer>
                        </section>
                    </div>`;
                                kambaModalContainer.innerHTML = kambaWidget;

                                //Style Widget Modal

                                kambaComponentCreator('main .kambaModalWidget', 'style', 'setProperty', {
                                    'border-radius': '0.2rem',
                                    'overflow': 'auto',
                                    'background': '#fff',
                                    'width': '100%',
                                    'position': 'absolute',
                                    'font-family': 'Montserrat, "sans-serif"',
                                    'font-size': '0.85rem',
                                    'box-shadow': '0 5px 8px 0 rgba(0,0,0,.2), 0 7px 20px 0 rgba(0,0,0,.10)'
                                });

                                //Header

                                kambaComponentCreator('.checkoutHeader', 'style', 'setProperty', { 'padding': '1rem 0 0 1rem' });

                                //Body

                                kambaComponentCreator('.headerWidget', 'style', 'setProperty', {
                                    'width': '100%',
                                    'float': 'left',
                                    'margin-top': '1rem',
                                    'background-color': '#fff'
                                });

                                kambaComponentCreator('.securityPay', 'style', 'setProperty', {
                                    'margin-right': '1rem',
                                    'float': 'left'
                                });

                                kambaComponentCreator('.textSecurityPay', 'style', 'setProperty', {
                                    'text-decoration': 'none',
                                    'display': 'flex',
                                    'justify-content': 'center',
                                    'box-sizing': 'border-box'
                                });

                                kambaComponentCreator('.ps', 'style', 'setProperty', {
                                    'margin-left': '0.2rem',
                                    'color': '#666666',
                                    'font-size': '0.8rem'
                                });

                                kambaComponentCreator('.qrPart', 'style', 'setProperty', {
                                    'width': '100%',
                                    'background-color': '#00ff5f',
                                    'position': 'relative'
                                });

                                kambaComponentCreator('.detailQr', 'style', 'setProperty', {
                                    'width': '90%',
                                    'float': 'left',
                                    'background-color': '#fff',
                                    'text-alight': 'center',
                                    'box-sizing': 'border-box'
                                });

                                kambaComponentCreator('.divSvg', 'style', 'setProperty', {
                                    'text-align': 'center',
                                    'padding': '0 1rem 1rem 1rem',
                                    'width': '100%'
                                });

                                kambaComponentCreator('.imgQr', 'style', 'setProperty', {
                                    'width': '50%',
                                    'height': '50%',
                                    'text-align': 'center',
                                    'box-shadow': '0px 0px 5px #7f7f7f',
                                    'border-radius': '0.3rem',
                                    'padding': '0.5rem',
                                });

                                kambaComponentCreator('.textValidate', 'style', 'setProperty', {
                                    'text-align': 'center',
                                    'font-size': '0.72rem',
                                    'margin-top': '1rem',
                                    'float': 'left',
                                    'width': '100%'
                                });


                                //Pay Detail
                                kambaComponentCreator('.partDetailPay', 'style', 'setProperty', {
                                    'width': '100%',
                                    'float': 'left',
                                    'background-color': '#fff'
                                });

                                kambaComponentCreator('.payDetail', 'style', 'setProperty', {
                                    'width': '92%',
                                    'float': 'left',
                                    'margin': '1rem 1rem 0 1rem'
                                });

                                kambaComponentCreator('.listProprietyProduct', 'style', 'setProperty', {
                                    'width': '100%',
                                    'list-style': 'none',
                                    'float': 'left',
                                    'margin-left': 0,
                                    'padding-left': 0,
                                    'background-color': '#fff'
                                });

                                kambaComponentCreator('.nameProduct', 'style', 'setProperty', {
                                    'float': 'left'
                                });

                                kambaComponentCreator('.priceProdut', 'style', 'setProperty', {
                                    'float': 'right'
                                });

                                kambaComponentCreator('.listTotal', 'style', 'setProperty', {
                                    'width': '100%',
                                    'list-style': 'none',
                                    'float': 'left',
                                    'margin-left': 0,
                                    'padding-left': 0,
                                    'background-color': '#fff',
                                    'border-bottom': '1px solid #d2cfcf'
                                });


                                kambaComponentCreator('.descriptionTotal', 'style', 'setProperty', {
                                    'float': 'left'
                                });

                                kambaComponentCreator('.priceTotal', 'style', 'setProperty', {
                                    'float': 'right'
                                });

                                kambaComponentCreator('.descriptionKamba', 'style', 'setProperty', {
                                    'width': '90%',
                                    'padding': '0 1rem',
                                    'text-align': 'center'
                                });

                                kambaComponentCreator('.helpKamba', 'style', 'setProperty', {
                                    'text-alight': 'center'
                                });


                                kambaComponentCreator('.optionHelpKamba1', 'style', 'setProperty', {
                                    'margin-top': '0.5rem'
                                });

                                kambaComponentCreator(['.optionHelpKamba2', '.optionHelpKamba3'], 'style', 'setProperty', {
                                    'margin-top': '0.8rem'
                                });

                                kambaComponentCreator('.appLinkKamba', 'style', 'setProperty', {
                                    'text-decoration': 'none',
                                    'color': '#0099ff'
                                });

                                kambaComponentCreator('.footerKamba', 'style', 'setProperty', {
                                    'width': '90%',
                                    'float': 'left',
                                    'padding': '0 1rem'
                                });
                                kambaComponentCreator('.descritionKambaMerchant', 'style', 'setProperty', {
                                    'margin': '1.7rem',
                                    'float': 'left'
                                });
                                kambaComponentCreator('.btnCloseWidgetKamba', 'style', 'setProperty', {
                                    'title': 'Sair do Pagamento',
                                    'border': 'none',
                                    'cursor': 'pointer',
                                    'font-size': '1rem',
                                    'border-radius': '0.3rem',
                                    'float': 'right',
                                    'color': 'red',
                                    'padding-top': '1.5rem'
                                }, (t) => {
                                    getComponents(t, 'click', () => {
                                        setComponentAttributes('main .kambaModalWidget', 'style', 'setProperty', {
                                            'display': 'none'
                                        });
                                    });
                                });

                                //Button for Pay Kamba
                                getComponents('.btnOpenWidgetKamba', 'click', () => {
                                    setComponentAttributes(kambaModalContainer, 'style', 'setProperty', {
                                        'display': 'flex'
                                    });
                                });

                                //Function Midia Query

                                //MEDIUM and LARGE
                                function midiaMediumDivice(x) {
                                    if (x.matches) {
                                        setComponentAttributes(kambaModalWidget, 'style', 'setProperty', {
                                            'width': '340px',
                                            'height': '490px'
                                        });
                                        setComponentAttributes(partDetailPay, 'style', 'setProperty', {
                                            'width': '100%',
                                            'float': 'left'
                                        });

                                        setComponentAttributes(descritionKambaMerchant, 'style', 'setProperty', {
                                            'float': 'left'
                                        });
                                        setComponentAttributes(descriptionKamba, 'style', 'setProperty', {
                                            'width': '91%'
                                        });
                                    }
                                }

                                var x = window.matchMedia("(min-width: 641px)")
                                midiaMediumDivice(x)
                                x.addListener(midiaMediumDivice)

                            });

                        } else {

                            response.json().then(() => {

                                templateModalErrorPayKamba();
                                setComponentAttributes('.textErrorKamba', undefined, undefined, {
                                    'innerHTML': "Falha!... Verifique suas configurações de pagamento ou entra em contacto com a equipe da Kamba"
                                });
                            });

                        }
                    })
                    .catch(() => {

                        templateModalErrorPayKamba();

                        var textErrorKamba = document.querySelector(".textErrorKamba");
                        textErrorKamba.innerHTML = "Falha!... Verifique sua conexão com a internet, ela pode estar muito lenta";
                    });



                function templateModalErrorPayKamba() {

                    var mainKambaModalContainer = kambaObjectCreator('main');
                    //Modal Container
                    var kambaModalContainer = document.getElementsByTagName("body")[0].appendChild(mainKambaModalContainer);

                    var kambaModalContainer = kambaComponentCreator(kambaModalContainer, 'style', 'setProperty', {
                        width: '100%',
                        height: '100%',
                        'background-color': 'rgba(0,0,0,.4)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        'z-index': '1000000000000000000000',
                        'display': 'flex',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'box-sizing': 'border-box',
                        'padding-right': '1rem',
                        'overflow': 'auto'
                    }, (e) => {
                        setComponentAttributes(e, 'classList', 'add', {
                            'kambaModalContainer': 'kambaModalContainer'
                        });
                    });

                    //to fixe
                    kambaModalContainer = getComponents(kambaModalContainer, 'click', () => {
                        setComponentAttributes(kambaModalContainer, 'style', 'setProperty', {
                            'display': 'none'
                        });
                    });

                    //Button for Pay Kamba
                    getComponents('.btnOpenWidgetKamba', 'click', (e) => {
                        setComponentAttributes(e, 'style', 'setProperty', {
                            'display': 'flex'
                        });
                    });
                    //Template
                    const kambaWidget = `

                    <div class="kambaModalWidget">
                        <section>
                                <p class="textErrorKamba"></p>
                        </section>
                    </div>`

                    kambaModalContainer.innerHTML = kambaWidget;
                    //Style Widget Modal

                    var kambaModalWidget = kambaComponentCreator('main .kambaModalWidget', 'style', 'setProperty', {
                        'border-radius': '0.2rem',
                        'overflow': 'auto',
                        'background-color': '#fff',
                        'width': '65%',
                        'height': '35%',
                        'position': 'absolute',
                        'font-family': '"Montserrat",sans-serif',
                        'font-size': '0.95rem',
                        'box-shadow': '0 5px 8px 0 rgba(0,0,0,.2), 0 7px 20px 0 rgba(0,0,0,.10)',
                        'display': 'flex',
                        'justify-content': 'center',
                        'align-items': 'center',
                        'box-sizing': 'border-box',
                        'text-align': 'center',
                        'padding': '1.5rem',
                        'color': 'red'
                    });


                    let checkMedia = () => {
                        let opt = {};
                        // check whether the browser support the function or not
                        if ('matchMedia' in windows) {
                            let lSize = window.matchMedia("(min-width: 641px)");
                            let hSize = window.matchMedia("(min-width: 1025px)");
                            if (lSize.matches) {
                                opt.height = '40%';
                                opt.width = '50%';
                                opt.obj = kambaModalWidget;
                            } else if (hSize.matches) {
                                opt.height = '25%';
                                opt.width = '30%';
                                opt.obj = kambaWidget;
                            }
                            setComponentAttributes(opt.obj, 'style', 'setProperty', opt, (e) => {
                                setComponentAttributes(e, 'addEventListener', undefined, {
                                    0: checkMedia
                                });
                            });
                        }

                    };
                    checkMedia();
                }
            });
        };
    })();
})();