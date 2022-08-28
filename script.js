let currentPokemon;
let loadedPokemons = [];
let likedPokemons = [];

let limit = 800;
let firstPokemon = 0;
let lastPokemon = 20;

let pokemonsContainer;
let pokemonId;
let pokemonPic1;
let pokemonPic2;
let pokemonName;
let pokemonsType;


/**
 * fetches pokemon from API
 */

async function loadPokemon() {
    for (let i = 1; i <= limit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        loadedPokemons.push(currentPokemon);

        if (i == 20) {
            renderPokemons();
        }
    }
    console.log('current pokemon: ', currentPokemon);
}


/**
 * renders name, id and pic of pokemons
 */

function renderPokemons() {
    pokemonsContainer = document.getElementById('pokemon-container');
    pokemonsContainer.innerHTML = '';

    for (let i = firstPokemon; i < lastPokemon; i++) {

        pokemonId = loadedPokemons[i]['id'];
        pokemonPic1 = loadedPokemons[i]['sprites']['other']['dream_world']['front_default'];
        pokemonPic2 = loadedPokemons[i]['sprites']['other']['home']['front_default'];
        pokemonName = loadedPokemons[i]['name'].charAt(0).toUpperCase() + loadedPokemons[i]['name'].slice(1).toLowerCase();
        pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];

        pokemonsContainer.innerHTML += `
            <div id="pokemon-card${i}" class="pokemon-card ${pokemonsType}" onclick="showFullscreen(${i})">
                <div class="pok-number-and-pic">
                    <div class="pok-number">
                        <span>#0${pokemonId}</span>
                    </div>
                    <div class="pok-img">
                        <img src="${pokemonPic1}" alt="">
                    </div>
                </div>
                <div class="pok-name-and-type" id="pok-name-and-type${i}">
                    <div class="name">
                        <span>${pokemonName}</span>
                    </div>
                </div>
            </div>
    `;
        renderType(i);
    }
    loadMorePokemonsbyScroll();
}


/**
 * renders types of pokemons
 * 
 * @param {integer} i - gives the related pokemon card address to the types
 */

function renderType(i) {
    let typesContainer = document.getElementById(`pok-name-and-type${i}`);

    for (let j = 0; j < loadedPokemons[i]['types'].length; j++) {

        pokemonsType = loadedPokemons[i]['types'][j]['type']['name'];

        typesContainer.innerHTML += `
         <div class="pok-type ${pokemonsType}-type">
             <span>${pokemonsType}</span>
         </div>
         `;
    }
}


/**
 * loads more pokemons 
 */

function loadMorePokemons() {
    if (loadedPokemons.length > lastPokemon) {
        lastPokemon += 20;
    } else {
        lastPokemon = loadedPokemons.length;
    }
    renderPokemons();
}


/**
 * loads more pokemons while scrolling down
 */

function loadMorePokemonsbyScroll() {
    window.onscroll = function() {
        if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
            loadMorePokemons();
        }
    }
}


/**
 * opens pokemon card in fullscreen
 * 
 * @param {integer} i - help to only fullscreen the clicked pokemon card 
 */

function fullscreen(i) {
    let fullscreen = document.getElementById('fullscreen-bg');
    // fullscreen.innerHTML = '';

    for (let k = 0; k < loadedPokemons[i]['types'].length; k++) {
        pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];

        fullscreen.innerHTML = `
    <div class="fullscreen ${pokemonsType}" id="fullscreen">
        <div class="close-btn" onclick="closeFullscreen()">
            <img src="./img/multiply-2-32.ico" alt="">
        </div>
        <div class="next-and-previous-btns">
            <img onclick="previousPokemon(${i})" src="./img/left.ico" alt="">
            <img onclick="nextPokemon(${i})" src="./img/right.ico" alt="">
        </div>
        <div class="name-and-number">
            <span class="name-fullscreen">${loadedPokemons[i]['name'].charAt(0).toUpperCase() + loadedPokemons[i]['name'].slice(1).toLowerCase()}</span>
            <span class="number-fullscreen">#${loadedPokemons[i]['id']}</span>
        </div>
        <div class="type-and-like">
            <div class="types-fullscreen" id="types-fullscreen${i}">
            </div>
           <!-- <img onclick="addToFavourites(${i})" class="heart" src="./img/heart.ico" alt=""> -->
        </div>
        <div class="big-img">
            <img src="${loadedPokemons[i]['sprites']['other']['dream_world']['front_default']}" alt="">
        </div>

        <div class="bottom ${pokemonsType}-type" id="bottom${i}">
            <div class="title">
                <div class="title-elements" onclick="showAbout()">About</div>
                <div class="title-elements" onclick="showBaseStats()">Base Stats</div>
                <div class="title-elements" onclick="showMoves()">Moves</div>
            </div>

            <div class="table-container">
                <div class="about-container " id="about-container">
                    <table class="tbl-about">
                        <tr class="about">
                            <td>Base experience</td>
                            <td>${loadedPokemons[i]['base_experience']}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>${loadedPokemons[i]['height']} m</td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>${loadedPokemons[i]['weight']} kg</td>
                        </tr>
                        <tr>
                            <td>Abilities</td>
                            <td id="tdAbility"></td>
                        </tr>
                    </table>
                </div>

                <div class="stat-container d-none" id="stat-container">
                    <table class="stat" id="stat"></table>
                </div>

                <div class="moves d-none" id="moves">
                
                </div>

            </div>

           

            
            
        </div>
    </div>
    `;
    }
    renderTypeFullscreen(i);
    RenderAbilities(i);
    renderMoves(i);
    renderBaseStat(i);
}


/**
 * renders types in fullscreen
 * @param {integer} i - renders types on the clicked pokemon cards
 */

function renderTypeFullscreen(i) {
    let typesFullscreen = document.getElementById(`types-fullscreen${i}`);

    for (let j = 0; j < loadedPokemons[i].types.length; j++) {

        pokemonsType = loadedPokemons[i]['types'][j]['type']['name'];

        typesFullscreen.innerHTML += `
        <div class="grass-fullscreen ${pokemonsType}-type" id="grass-fullscreen">
            <span>${pokemonsType}</span>
        </div>
        `;
    }
}


/**
 * shows fullscreen
 */
function showFullscreen(i) {
    document.getElementById('fullscreen-bg').style.zIndex = 1;
    document.body.style.overflow = 'hidden';

    fullscreen(i);
}


/**
 * closes fullscreen
 */

function closeFullscreen(i) {
    document.getElementById('fullscreen').classList.add('d-none');
    document.getElementById('fullscreen-bg').style.zIndex = -1;
    document.body.style.overflow = 'visible';
}


/**
 * renders abilities in fullscreen
 * @param {integer} i 
 */

function RenderAbilities(i) {
    let renderAbility = document.getElementById('tdAbility');
    for (let m = 0; m < loadedPokemons[i]['abilities'].length; m++) {
        renderAbility.innerHTML += `
         <span class="ability-bg">${loadedPokemons[i]['abilities'][m]['ability']['name']}</span>
 `;
    }
}


/**
 * renders base stats in fullscreen
 * 
 * @param {*} i 
 */

function renderBaseStat(i) {
    for (let l = 0; l < loadedPokemons[i]['stats'].length; l++) {
        let statName = loadedPokemons[i]['stats'][l]['stat']['name'].charAt(0).toUpperCase() + loadedPokemons[i]['stats'][l]['stat']['name'].slice(1).toLowerCase();
        let statTbl = document.getElementById('stat');
        statTbl.innerHTML += `
            <tr>
                <td>${statName}</td>
                <td>${ loadedPokemons[i]['stats'][l]['base_stat']}</td>
            </tr>
             `;
    }
}


/**
 * shows moves section in fullscreen
 */

function renderMoves(i) {
    for (let k = 0; k < loadedPokemons[i]['moves'].length; k++) {
        let movesName = loadedPokemons[i]['moves'][k]['move']['name'];
        let movesDiv = document.getElementById('moves');
        movesDiv.innerHTML += `
            <span class="moves-span">${movesName}</span>
        `;
    }
}


/**
 * shows about section in fullscreen
 */

function showAbout() {
    document.getElementById('about-container').classList.remove('d-none');
    document.getElementById('moves').classList.add('d-none');
    document.getElementById('stat-container').classList.add('d-none');
}


/**
 * shows base stats section in fullscreen
 */

function showBaseStats() {
    document.getElementById('about-container').classList.add('d-none');
    document.getElementById('moves').classList.add('d-none');
    document.getElementById('stat-container').classList.remove('d-none');
}



/**
 * shows move section in fullscreen
 */

function showMoves() {
    document.getElementById('about-container').classList.add('d-none');
    document.getElementById('stat-container').classList.add('d-none');
    document.getElementById('moves').classList.remove('d-none');
}





/**
 * shows next pokemon in fullscreen
 */

function nextPokemon(i) {
    if (i < loadedPokemons.length) {
        i++;
    } else {
        i = 0;
    }
    showFullscreen(i);
}


/**
 * shows previous pokemon in fullscreen
 */

function previousPokemon(i) {
    if (i <= loadedPokemons.length) {
        i--;
    } else {
        i = loadedPokemons.length;
    }
    showFullscreen(i);
}


/**
 * searches pokemons
 */

function search() {
    let inputValue = document.getElementById('input').value;
    inputValue = inputValue.toLowerCase();
    document.getElementById('pokemon-container').innerHTML = '';
    if (inputValue == 0) {
        reload();
    } else {
        for (let i = 0; i < loadedPokemons.length; i++) {
            if (loadedPokemons[i]['name'].toLowerCase().includes(inputValue)) {
                showSearchedPokemon(i);
            }
        }
    }
}


/**
 * renders found pokemons
 */

function showSearchedPokemon(i) {
    pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];
    document.getElementById('pokemon-container').innerHTML += `
        <div id="pokemon-card${i}" class="pokemon-card ${pokemonsType}" onclick="showFullscreen(${i})">
            <div class="pok-number-and-pic">
                <div class="pok-number">
                    <span>#0${loadedPokemons[i]['id']}</span>
                </div>
                <div class="pok-img">
                    <img src="${loadedPokemons[i]['sprites']['other']['dream_world']['front_default']}" alt="">
                </div>
            </div>
            <div class="pok-name-and-type" id="pok-name-and-type${i}">
                <div class="name">
                    <span>${loadedPokemons[i]['name'].toUpperCase()}</span>
                </div>
                
            </div>
        </div>
       `;
    for (let j = 0; j < loadedPokemons[i]['types'].length; j++) {
        let typesContainer = document.getElementById(`pok-name-and-type${i}`);
        pokemonsType = loadedPokemons[i]['types'][j]['type']['name'];

        typesContainer.innerHTML += `
        <div class="pok-type ${pokemonsType}-type" id="pok-type${i}">
            <span>${pokemonsType}</span>
        </div>
        `;
    }
}


/**
 * reloads the page
 */

function reload() {
    window.location.reload();
}


/**
 * adds selected pokemon  to likedPokemons array
 */

function addToFavourites(i) {
    let pokemonsCard = document.getElementById(`pokemon-card${i}`);
    likedPokemons.push(pokemonsCard);
}


/**
 * adds selected pokemon  to likedPokemons array
 */

// function renderFavourites(i) {
//     for (let n  = 0; n < likedPokemons.length; n++) {
//         const element = likedPokemons[i];

//     }
// }

/**
 * shows imprint
 */

function showImprint() {
    let imprint = document.getElementById('contents');
    imprint.innerHTML = '';

    imprint.innerHTML = `     
    <div class="imprint">
    <div class='impressum'><h1>Impressum</h1><p>Angaben gemäß § 5 TMG</p><p>Masihullah Massudi <br> 
    Juri-Gagarin-Ring 128<br> 
    99084 Erfurt <br> 
    </p><p><strong>Kontakt:</strong> <br>
    Telefon: 0157-59740985<br>
    E-Mail: <a href='masihullahmassudi84@gmail.com'>masihullahmassudi84@gmail.com</a></br></p>
    <br><strong>Haftung für Inhalte</strong><br><br>
    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.<br><br><strong>Haftung für Links</strong><br><br>
    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br><br><strong>Urheberrecht</strong><br><br>
    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br><br><strong>Datenschutz</strong><br><br>
    Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br>
    Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich. <br>
    Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br>
    <br><br><strong>Google Analytics</strong><br><br>
    Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (''Google''). Google Analytics verwendet sog. ''Cookies'', Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.<br><br><strong>Google AdSense</strong><br><br>
    Diese Website benutzt Google Adsense, einen Webanzeigendienst der Google Inc., USA (''Google''). Google Adsense verwendet sog. ''Cookies'' (Textdateien), die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglicht. Google Adsense verwendet auch sog. ''Web Beacons'' (kleine unsichtbare Grafiken) zur Sammlung von Informationen. Durch die Verwendung des Web Beacons können einfache Aktionen wie der Besucherverkehr auf der Webseite aufgezeichnet und gesammelt werden. Die durch den Cookie und/oder Web Beacon erzeugten Informationen über Ihre Benutzung dieser Website (einschließlich Ihrer IP-Adresse) werden an einen Server von Google in den USA übertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website im Hinblick auf die Anzeigen auszuwerten, um Reports über die Websiteaktivitäten und Anzeigen für die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Das Speichern von Cookies auf Ihrer Festplatte und die Anzeige von Web Beacons können Sie verhindern, indem Sie in Ihren Browser-Einstellungen ''keine Cookies akzeptieren'' wählen (Im MS Internet-Explorer unter ''Extras > Internetoptionen > Datenschutz > Einstellung''; im Firefox unter ''Extras > Einstellungen > Datenschutz > Cookies''); wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.</p><br> 
    Website Impressum von <a href="https://www.impressum-generator.de">impressum-generator.de</a>
    </div>
    </div>
    `;
}


/**
 * shows polic
 */

function showPolicy() {
    let policy = document.getElementById('contents');
    policy.innerHTML = '';

    policy.innerHTML = `
    <div class="privacy">     
    <h1>Datenschutzerklärung</h1>
    <h2 id="m14">Einleitung</h2>
    <p>Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten“ bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung
        gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie
        z.B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als "Onlineangebot“).</p>
    <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
    <p>Stand: 5. Mai 2022</p>
    <h2>Inhaltsübersicht</h2>
    <ul class="index">
        <li><a class="index-link" href="#m14">Einleitung</a></li>
        <li><a class="index-link" href="#m3">Verantwortlicher</a></li>
        <li><a class="index-link" href="#mOverview">Übersicht der Verarbeitungen</a></li>
        <li><a class="index-link" href="#m13">Maßgebliche Rechtsgrundlagen</a></li>
        <li><a class="index-link" href="#m27">Sicherheitsmaßnahmen</a></li>
        <li><a class="index-link" href="#m25">Übermittlung von personenbezogenen Daten</a></li>
        <li><a class="index-link" href="#m24">Datenverarbeitung in Drittländern</a></li>
        <li><a class="index-link" href="#m12">Löschung von Daten</a></li>
        <li><a class="index-link" href="#m134">Einsatz von Cookies</a></li>
        <li><a class="index-link" href="#m225">Bereitstellung des Onlineangebotes und Webhosting</a></li>
        <li><a class="index-link" href="#m182">Kontakt- und Anfragenverwaltung</a></li>
        <li><a class="index-link" href="#m15">Änderung und Aktualisierung der Datenschutzerklärung</a></li>
        <li><a class="index-link" href="#m10">Rechte der betroffenen Personen</a></li>
        <li><a class="index-link" href="#m42">Begriffsdefinitionen</a></li>
    </ul>
    <h2 id="m3">Verantwortlicher</h2>
    <h2 id="mOverview">Übersicht der Verarbeitungen</h2>
    <p>Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p>
    <h3>Arten der verarbeiteten Daten</h3>
    <ul>
        <li>Bestandsdaten.</li>
        <li>Kontaktdaten.</li>
        <li>Inhaltsdaten.</li>
        <li>Nutzungsdaten.</li>
        <li>Meta-/Kommunikationsdaten.</li>
    </ul>
    <h3>Kategorien betroffener Personen</h3>
    <ul>
        <li>Kommunikationspartner.</li>
        <li>Nutzer.</li>
    </ul>
    <h3>Zwecke der Verarbeitung</h3>
    <ul>
        <li>Erbringung vertraglicher Leistungen und Kundenservice.</li>
        <li>Kontaktanfragen und Kommunikation.</li>
        <li>Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
    </ul>
    <h3 id="m13">Maßgebliche Rechtsgrundlagen</h3>
    <p>Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem
        Wohn- oder Sitzland gelten können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.</p>
    <ul>
        <li><strong>Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO)</strong> - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher
            Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.</li>
        <li><strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO)</strong> - Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.</li>
        <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO)</strong> - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten
            der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen.</li>
    </ul>
    <p>Zusätzlich zu den Datenschutzregelungen der Datenschutz-Grundverordnung gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz
        – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung
        sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Des Weiteren regelt es die Datenverarbeitung für Zwecke des Beschäftigungsverhältnisses (§ 26 BDSG), insbesondere im Hinblick auf die Begründung, Durchführung oder
        Beendigung von Beschäftigungsverhältnissen sowie die Einwilligung von Beschäftigten. Ferner können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.</p>
    <h2 id="m27">Sicherheitsmaßnahmen</h2>
    <p>Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten
        und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.</p>
    <p>Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe,
        der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen
        wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.</p>
    <p>SSL-Verschlüsselung (https): Um Ihre via unserem Online-Angebot übermittelten Daten zu schützen, nutzen wir eine SSL-Verschlüsselung. Sie erkennen derart verschlüsselte Verbindungen an dem Präfix https:// in der Adresszeile Ihres Browsers.</p>
    <h2 id="m25">Übermittlung von personenbezogenen Daten</h2>
    <p>Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass die Daten an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt oder sie ihnen gegenüber offengelegt werden. Zu den Empfängern
        dieser Daten können z.B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter von Diensten und Inhalten, die in eine Webseite eingebunden werden, gehören. In solchen Fall beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende
        Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.</p>
    <h2 id="m24">Datenverarbeitung in Drittländern</h2>
    <p>Sofern wir Daten in einem Drittland (d.h., außerhalb der Europäischen Union (EU), des Europäischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter oder der Offenlegung bzw. Übermittlung
        von Daten an andere Personen, Stellen oder Unternehmen stattfindet, erfolgt dies nur im Einklang mit den gesetzlichen Vorgaben. </p>
    <p>Vorbehaltlich ausdrücklicher Einwilligung oder vertraglich oder gesetzlich erforderlicher Übermittlung verarbeiten oder lassen wir die Daten nur in Drittländern mit einem anerkannten Datenschutzniveau, vertraglichen Verpflichtung durch sogenannte
        Standardschutzklauseln der EU-Kommission, beim Vorliegen von Zertifizierungen oder verbindlicher internen Datenschutzvorschriften verarbeiten (Art. 44 bis 49 DSGVO, Informationsseite der EU-Kommission: <a href="https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de"
            target="_blank">https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de</a>).</p>
    <h2 id="m12">Löschung von Daten</h2>
    <p>Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen Vorgaben gelöscht, sobald deren zur Verarbeitung erlaubten Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen (z.B. wenn der Zweck der Verarbeitung dieser Daten
        entfallen ist oder sie für den Zweck nicht erforderlich sind).</p>
    <p>Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung auf diese Zwecke beschränkt. D.h., die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z.B.
        für Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen
        Person erforderlich ist.</p>
    <p>Unsere Datenschutzhinweise können ferner weitere Angaben zu der Aufbewahrung und Löschung von Daten beinhalten, die für die jeweiligen Verarbeitungen vorrangig gelten.</p>
    <h2 id="m134">Einsatz von Cookies</h2>
    <p>Cookies sind kleine Textdateien, bzw. sonstige Speichervermerke, die Informationen auf Endgeräten speichern und Informationen aus den Endgeräten auslesen. Z.B. um den Login-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem E-Shop, die aufgerufenen
        Inhalte oder verwendete Funktionen eines Onlineangebotes speichern. Cookies können ferner zu unterschiedlichen Zwecken eingesetzt werden, z.B. zu Zwecken der Funktionsfähigkeit, Sicherheit und Komfort von Onlineangeboten sowie der Erstellung von
        Analysen der Besucherströme. </p>
    <p><strong>Hinweise zur Einwilligung: </strong>Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein. Daher holen wir von den Nutzern eine vorhergehende Einwilligung ein, außer wenn diese gesetzlich nicht gefordert ist. Eine Einwilligung
        ist insbesondere nicht notwendig, wenn das Speichern und das Auslesen der Informationen, also auch von Cookies, unbedingt erforderlich sind, um dem den Nutzern einen von ihnen ausdrücklich gewünschten Telemediendienst (also unser Onlineangebot)
        zur Verfügung zu stellen. Die widerrufliche Einwilligung wird gegenüber den Nutzern deutlich kommuniziert und enthält die Informationen zu der jeweiligen Cookie-Nutzung.</p>
    <p><strong>Hinweise zu datenschutzrechtlichen Rechtsgrundlagen: </strong>Auf welcher datenschutzrechtlichen Rechtsgrundlage wir die personenbezogenen Daten der Nutzer mit Hilfe von Cookies verarbeiten, hängt davon ab, ob wir Nutzer um eine Einwilligung
        bitten. Falls die Nutzer einwilligen, ist die Rechtsgrundlage der Verarbeitung Ihrer Daten die erklärte Einwilligung. Andernfalls werden die mithilfe von Cookies verarbeiteten Daten auf Grundlage unserer berechtigten Interessen (z.B. an einem
        betriebswirtschaftlichen Betrieb unseres Onlineangebotes und Verbesserung seiner Nutzbarkeit) verarbeitet oder, wenn dies im Rahmen der Erfüllung unserer vertraglichen Pflichten erfolgt, wenn der Einsatz von Cookies erforderlich ist, um unsere
        vertraglichen Verpflichtungen zu erfüllen. Zu welchen Zwecken die Cookies von uns verarbeitet werden, darüber klären wir im Laufe dieser Datenschutzerklärung oder im Rahmen von unseren Einwilligungs- und Verarbeitungsprozessen auf.</p>
    <p><strong>Speicherdauer: </strong>Im Hinblick auf die Speicherdauer werden die folgenden Arten von Cookies unterschieden:</p>
    <ul>
        <li><strong>Temporäre Cookies (auch: Session- oder Sitzungs-Cookies):</strong> Temporäre Cookies werden spätestens gelöscht, nachdem ein Nutzer ein Online-Angebot verlassen und sein Endgerät (z.B. Browser oder mobile Applikation) geschlossen hat.</li>
        <li><strong>Permanente Cookies:</strong> Permanente Cookies bleiben auch nach dem Schließen des Endgerätes gespeichert. So können beispielsweise der Login-Status gespeichert oder bevorzugte Inhalte direkt angezeigt werden, wenn der Nutzer eine Website
            erneut besucht. Ebenso können die mit Hilfe von Cookies erhobenen Daten der Nutzer zur Reichweitenmessung verwendet werden. Sofern wir Nutzern keine expliziten Angaben zur Art und Speicherdauer von Cookies mitteilen (z. B. im Rahmen der Einholung
            der Einwilligung), sollten Nutzer davon ausgehen, dass Cookies permanent sind und die Speicherdauer bis zu zwei Jahre betragen kann.</li>
    </ul>
    <p><strong>Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-Out): </strong>Nutzer können die von ihnen abgegebenen Einwilligungen jederzeit Widerrufen und zudem einen Widerspruch gegen die Verarbeitung entsprechend den gesetzlichen Vorgaben im Art.
        21 DSGVO einlegen (weitere Hinweise zum Widerspruch erfolgen im Rahmen dieser Datenschutzerklärung). Nutzer können Ihren Widerspruch auch mittels der Einstellungen Ihres Browsers erklären.</p>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Verarbeitung von Cookie-Daten auf Grundlage einer Einwilligung: </strong>Wir setzen ein Verfahren zum Cookie-Einwilligungs-Management ein, in dessen Rahmen die Einwilligungen der Nutzer in den Einsatz von Cookies, bzw. der im Rahmen des
            Cookie-Einwilligungs-Management-Verfahrens genannten Verarbeitungen und Anbieter eingeholt sowie von den Nutzern verwaltet und widerrufen werden können. Hierbei wird die Einwilligungserklärung gespeichert, um deren Abfrage nicht erneut wiederholen
            zu müssen und die Einwilligung entsprechend der gesetzlichen Verpflichtung nachweisen zu können. Die Speicherung kann serverseitig und/oder in einem Cookie (sogenanntes Opt-In-Cookie, bzw. mithilfe vergleichbarer Technologien) erfolgen, um
            die Einwilligung einem Nutzer, bzw. dessen Gerät zuordnen zu können. Vorbehaltlich individueller Angaben zu den Anbietern von Cookie-Management-Diensten, gelten die folgenden Hinweise: Die Dauer der Speicherung der Einwilligung kann bis zu
            zwei Jahren betragen. Hierbei wird ein pseudonymer Nutzer-Identifikator gebildet und mit dem Zeitpunkt der Einwilligung, Angaben zur Reichweite der Einwilligung (z. B. welche Kategorien von Cookies und/oder Diensteanbieter) sowie dem Browser,
            System und verwendeten Endgerät gespeichert.</li>
    </ul>
    <h2 id="m225">Bereitstellung des Onlineangebotes und Webhosting</h2>
    <p>Um unser Onlineangebot sicher und effizient bereitstellen zu können, nehmen wir die Leistungen von einem oder mehreren Webhosting-Anbietern in Anspruch, von deren Servern (bzw. von ihnen verwalteten Servern) das Onlineangebot abgerufen werden kann.
        Zu diesen Zwecken können wir Infrastruktur- und Plattformdienstleistungen, Rechenkapazität, Speicherplatz und Datenbankdienste sowie Sicherheitsleistungen und technische Wartungsleistungen in Anspruch nehmen.</p>
    <p>Zu den im Rahmen der Bereitstellung des Hostingangebotes verarbeiteten Daten können alle die Nutzer unseres Onlineangebotes betreffenden Angaben gehören, die im Rahmen der Nutzung und der Kommunikation anfallen. Hierzu gehören regelmäßig die IP-Adresse,
        die notwendig ist, um die Inhalte von Onlineangeboten an Browser ausliefern zu können, und alle innerhalb unseres Onlineangebotes oder von Webseiten getätigten Eingaben.</p>
    <ul class="m-elements">
        <li><strong>Verarbeitete Datenarten:</strong> Inhaltsdaten (z.B. Eingaben in Onlineformularen); Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen).</li>
        <li><strong>Betroffene Personen:</strong> Nutzer (z.B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
        <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
        <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO).</li>
    </ul>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Wir selbst (bzw. unser Webhostinganbieter) erheben Daten zu jedem Zugriff auf den Server (sogenannte Serverlogfiles). Zu den Serverlogfiles können die Adresse und Name der abgerufenen Webseiten
            und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende
            Provider gehören. Die Serverlogfiles können zum einen zu Zwecken der Sicherheit eingesetzt werden, z.B., um eine Überlastung der Server zu vermeiden (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken) und zum anderen,
            um die Auslastung der Server und ihre Stabilität sicherzustellen; <strong>Löschung von Daten:</strong> Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere
            Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen Vorfalls von der Löschung ausgenommen.</li>
    </ul>
    <h2 id="m182">Kontakt- und Anfragenverwaltung</h2>
    <p>Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Geschäftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet soweit dies zur Beantwortung der
        Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.</p>
    <p>Die Beantwortung der Kontaktanfragen sowie die Verwaltung von Kontakt- und Anfragedaten im Rahmen von vertraglichen oder vorvertraglichen Beziehungen erfolgt zur Erfüllung unserer vertraglichen Pflichten oder zur Beantwortung von (vor)vertraglichen
        Anfragen und im Übrigen auf Grundlage der berechtigten Interessen an der Beantwortung der Anfragen und Pflege von Nutzer- bzw. Geschäftsbeziehungen.</p>
    <ul class="m-elements">
        <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z.B. Namen, Adressen); Kontaktdaten (z.B. E-Mail, Telefonnummern); Inhaltsdaten (z.B. Eingaben in Onlineformularen).</li>
        <li><strong>Betroffene Personen:</strong> Kommunikationspartner.</li>
        <li><strong>Zwecke der Verarbeitung:</strong> Kontaktanfragen und Kommunikation; Erbringung vertraglicher Leistungen und Kundenservice.</li>
        <li><strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO); Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO).</li>
    </ul>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Kontaktformular: </strong>Wenn Nutzer über unser Kontaktformular, E-Mail oder andere Kommunikationswege mit uns in Kontakt treten, verarbeiten wir die uns in diesem Zusammenhang mitgeteilten Daten zur Bearbeitung des mitgeteilten Anliegens.
            Zu diesem Zweck verarbeiten wir personenbezogene Daten im Rahmen vorvertraglicher und vertraglicher Geschäftsbeziehungen, soweit dies zu deren Erfüllung erforderlich ist und im Übrigen auf Grundlage unserer berechtigten Interessen sowie der
            Interessen der Kommunikationspartner an der Beantwortung der Anliegen und unserer gesetzlichen Aufbewahrungspflichten.</li>
    </ul>
    <h2 id="m15">Änderung und Aktualisierung der Datenschutzerklärung</h2>
    <p>Wir bitten Sie, sich regelmäßig über den Inhalt unserer Datenschutzerklärung zu informieren. Wir passen die Datenschutzerklärung an, sobald die Änderungen der von uns durchgeführten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie,
        sobald durch die Änderungen eine Mitwirkungshandlung Ihrerseits (z.B. Einwilligung) oder eine sonstige individuelle Benachrichtigung erforderlich wird.</p>
    <p>Sofern wir in dieser Datenschutzerklärung Adressen und Kontaktinformationen von Unternehmen und Organisationen angeben, bitten wir zu beachten, dass die Adressen sich über die Zeit ändern können und bitten die Angaben vor Kontaktaufnahme zu prüfen.</p>
    <h2 id="m10">Rechte der betroffenen Personen</h2>
    <p>Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:</p>
    <ul>
        <li><strong>Widerspruchsrecht: Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.</strong></li>
        <li><strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.</li>
        <li><strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen
            Vorgaben.
        </li>
        <li><strong>Recht auf Berichtigung:</strong> Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.</li>
        <li><strong>Recht auf Löschung und Einschränkung der Verarbeitung:</strong> Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen
            Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.</li>
        <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder
            deren Übermittlung an einen anderen Verantwortlichen zu fordern.</li>
        <li><strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
            Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die Vorgaben der DSGVO verstößt.</li>
    </ul>
    <h2 id="m42">Begriffsdefinitionen</h2>
    <p>In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser Datenschutzerklärung verwendeten Begrifflichkeiten. Viele der Begriffe sind dem Gesetz entnommen und vor allem im Art. 4 DSGVO definiert. Die gesetzlichen Definitionen sind verbindlich.
        Die nachfolgenden Erläuterungen sollen dagegen vor allem dem Verständnis dienen. Die Begriffe sind alphabetisch sortiert.</p>
    <ul class="glossary">
        <li><strong>Personenbezogene Daten:</strong> "Personenbezogene Daten“ sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden "betroffene Person“) beziehen; als identifizierbar wird eine natürliche
            Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z.B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert
            werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind. </li>
        <li><strong>Verantwortlicher:</strong> Als "Verantwortlicher“ wird die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
            Daten entscheidet, bezeichnet. </li>
        <li><strong>Verarbeitung:</strong> "Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch
            jeden Umgang mit Daten, sei es das Erheben, das Auswerten, das Speichern, das Übermitteln oder das Löschen. </li>
    </ul>
    <p>
        <a href="https://datenschutz-generator.de/" title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." target="_blank" rel="noopener noreferrer nofollow"><img src="https://datenschutz-generator.de/wp-content/plugins/ts-dsg/images/dsg-seal/dsg-seal-pp-de.png" alt="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." width="250" height="250"></a>
    </p>
    </div>   
    `;
}