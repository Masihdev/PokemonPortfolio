let currentPokemon;
let loadedPokemons = [];
let likedPokemons = [];
let limit = 620;
let firstPokemon = 0;
let lastPokemon = 20;
let pokemonsContainer;
let pokemonId;
let pokemonPic1;
let pokemonPic2;
let pokemonName;
let pokemonsType;
let next_pokemon_sound = new Audio('./audio/next_pokemon.mp3')
let open_fullscreen_sound = new Audio('./audio/open_fullscreen.mp3')
let close_fullscreen_sound = new Audio('./audio/close_fullscreen.mp3')


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
        pokemonsContainer.innerHTML += generatePokCard(i);
        renderType(i);
    }
    loadMorePokemonsbyScroll();
}


/**
 * generate pokemon card 
 */

function generatePokCard(i) {
    pokemonId = loadedPokemons[i]['id'];
    pokemonPic1 = loadedPokemons[i]['sprites']['other']['dream_world']['front_default'];
    pokemonPic2 = loadedPokemons[i]['sprites']['other']['home']['front_default'];
    pokemonName = loadedPokemons[i]['name'].charAt(0).toUpperCase() + loadedPokemons[i]['name'].slice(1).toLowerCase();
    pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];

    return `
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
    let fullscreen = document.getElementById('f-container');
    // fullscreen.innerHTML = '';

    for (let k = 0; k < loadedPokemons[i]['types'].length; k++) {
        pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];
        fullscreen.innerHTML = generateBigCard(i);
    }
    renderTypeFullscreen(i);
    showAbout(i);
}


/**
 * loads more pokemons while scrolling down
 */

function generateBigCard(i) {
    pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];

    return `
    <div class="fullscreen ${pokemonsType}" id="fullscreen">
        <div class="close-btn" >
            <img onclick="closeFullscreen()" class="opac-1" src="./img/multiply-2-32.ico" alt="">
        </div>
        <div class="next-and-previous-btns">
            <img class="opac-1" onclick="previousPokemon(${i})" src="./img/left.ico" alt="">
            <img class="opac-1" onclick="nextPokemon(${i})" src="./img/right.ico" alt="">
        </div>
        <div class="name-and-number">
            <span class="name-fullscreen">${loadedPokemons[i]['name']}</span>
            <span class="number-fullscreen">#${loadedPokemons[i]['id']}</span>
        </div>
        <div class="type-and-like">
            <div class="types-fullscreen" id="types-fullscreen${i}">
            </div>
        <!-- <img onclick="addToFavourites(${i})" class="heart opac-1" src="./img/heart.ico" alt=""> -->
        </div>
        <div class="big-img">
            <img src="${loadedPokemons[i]['sprites']['other']['dream_world']['front_default']}" alt="">
        </div>
    </div>
    <div class="bottom ${pokemonsType}-type" id="bottom${i}">
        <div class="title">
            <div class="title-elements" onclick="showAbout(${i})">About</div>
            <div class="title-elements" onclick="showBaseStats(${i})">Base Stats</div>
            <div class="title-elements" onclick="showMoves(${i})">Moves</div>
        </div>
        <div class="bottom-content" id="bottom-content"
           
        </div>
    </div>
    `;
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
    // open_fullscreen_sound.play();
    document.body.style.overflow = 'hidden';
    fullscreen(i);
}


/**
 * closes fullscreen
 */

function closeFullscreen() {
    document.getElementById('fullscreen').classList.add('d-none');
    document.getElementById('fullscreen-bg').style.zIndex = -1;
    // close_fullscreen_sound.play();
    // close_fullscreen_sound.volume = 0.1;
    open_fullscreen_sound.play();
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
 * shows about section in fullscreen
 */

function renderAbout(i) {
    for (let k = 0; k < loadedPokemons[i]['types'].length; k++) {
        let aboutTbl = document.getElementById('about-tbl');

        aboutTbl.innerHTML = `
                <table class="tbl-about">
                    <tr>
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
        `;
    }
    RenderAbilities(i);
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

function showAbout(i) {
    let bottomFullscreen = document.getElementById('bottom-content');
    bottomFullscreen.innerHTML = '';

    bottomFullscreen.innerHTML = `
    <div class="about-tbl" id="about-tbl">
        
    </div>
    `;
    renderAbout(i);
}


/**
 * shows base stats section in fullscreen
 */

function showBaseStats(i) {
    let bottomFullscreen = document.getElementById('bottom-content');
    bottomFullscreen.innerHTML = '';

    bottomFullscreen.innerHTML = `
        <div class="stat-container">
            <table class="stat" id="stat">
        
            </table>
        </div>
    `;
    renderBaseStat(i);
}


/**
 * shows move section in fullscreen
 */

function showMoves(i) {
    let bottomFullscreen = document.getElementById('bottom-content');
    bottomFullscreen.innerHTML = '';

    bottomFullscreen.innerHTML = `
    <div class="moves" id="moves">
                
    </div>
    `;
    renderMoves(i);
}


/**
 * shows next pokemon in fullscreen
 */

function nextPokemon(i) {
    if (i >= 619) {
        i = 0;
    } else {
        i++;
        next_pokemon_sound.play();
    }
    showFullscreen(i);
}


/**
 * shows previous pokemon in fullscreen
 */

function previousPokemon(i) {
    if (i <= 0) {
        i = 619;
    } else {
        i--;
        next_pokemon_sound.play();
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

    for (let i = 0; i < loadedPokemons.length; i++) {
        if (loadedPokemons[i]['name'].toLowerCase().includes(inputValue)) {
            showSearchedPokemon(i);
        }
    }
}


/**
 * on enter-click runsearch function
 */

function key(e) {
    if (e.keyCode == 13) {
        search();
    }
}


/**
 * renders found pokemons
 */

function showSearchedPokemon(i) {
    document.getElementById('pokemon-container').innerHTML += generatePokSearchedCard(i);
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
 * generate card for searched pokemon
 */

function generatePokSearchedCard(i) {
    pokemonsType = loadedPokemons[i]['types'][0]['type']['name'];

    return `
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
}


/**
 * shows imprint
 */

function showImprint() {
    let imprint = document.getElementById('contents');
    imprint.innerHTML = '';

    imprint.innerHTML = `     
    <div class="imprint">
    <div class='impressum'><h1>Impressum</h1><p>Angaben gem???? ?? 5 TMG</p><p>Masihullah Massudi <br> 
    Juri-Gagarin-Ring 128<br> 
    99084 Erfurt <br> 
    </p><p><strong>Kontakt:</strong> <br>
    Telefon: 0157-59740985<br>
    E-Mail: <a href='masihullahmassudi84@gmail.com'>masihullahmassudi84@gmail.com</a></br></p>
    <br><strong>Haftung f??r Inhalte</strong><br><br>
    Die Inhalte unserer Seiten wurden mit gr????ter Sorgfalt erstellt. F??r die Richtigkeit, Vollst??ndigkeit und Aktualit??t der Inhalte k??nnen wir jedoch keine Gew??hr ??bernehmen. Als Diensteanbieter sind wir gem???? ?? 7 Abs.1 TMG f??r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach ???? 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, ??bermittelte oder gespeicherte fremde Informationen zu ??berwachen oder nach Umst??nden zu forschen, die auf eine rechtswidrige T??tigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber??hrt. Eine diesbez??gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m??glich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.<br><br><strong>Haftung f??r Links</strong><br><br>
    Unser Angebot enth??lt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k??nnen wir f??r diese fremden Inhalte auch keine Gew??hr ??bernehmen. F??r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m??gliche Rechtsverst????e ??berpr??ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.<br><br><strong>Urheberrecht</strong><br><br>
    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf??ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au??erhalb der Grenzen des Urheberrechtes bed??rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f??r den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.<br><br><strong>Datenschutz</strong><br><br>
    Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten m??glich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit m??glich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdr??ckliche Zustimmung nicht an Dritte weitergegeben. <br>
    Wir weisen darauf hin, dass die Daten??bertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitsl??cken aufweisen kann. Ein l??ckenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht m??glich. <br>
    Der Nutzung von im Rahmen der Impressumspflicht ver??ffentlichten Kontaktdaten durch Dritte zur ??bersendung von nicht ausdr??cklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdr??cklich widersprochen. Die Betreiber der Seiten behalten sich ausdr??cklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br>
    <br><br><strong>Google Analytics</strong><br><br>
    Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. (''Google''). Google Analytics verwendet sog. ''Cookies'', Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie erm??glicht. Die durch den Cookie erzeugten Informationen ??ber Ihre Benutzung dieser Website (einschlie??lich Ihrer IP-Adresse) wird an einen Server von Google in den USA ??bertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports ??ber die Websiteaktivit??ten f??r die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte ??bertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Sie k??nnen die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht s??mtliche Funktionen dieser Website voll umf??nglich nutzen k??nnen. Durch die Nutzung dieser Website erkl??ren Sie sich mit der Bearbeitung der ??ber Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.<br><br><strong>Google AdSense</strong><br><br>
    Diese Website benutzt Google Adsense, einen Webanzeigendienst der Google Inc., USA (''Google''). Google Adsense verwendet sog. ''Cookies'' (Textdateien), die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie erm??glicht. Google Adsense verwendet auch sog. ''Web Beacons'' (kleine unsichtbare Grafiken) zur Sammlung von Informationen. Durch die Verwendung des Web Beacons k??nnen einfache Aktionen wie der Besucherverkehr auf der Webseite aufgezeichnet und gesammelt werden. Die durch den Cookie und/oder Web Beacon erzeugten Informationen ??ber Ihre Benutzung dieser Website (einschlie??lich Ihrer IP-Adresse) werden an einen Server von Google in den USA ??bertragen und dort gespeichert. Google wird diese Informationen benutzen, um Ihre Nutzung der Website im Hinblick auf die Anzeigen auszuwerten, um Reports ??ber die Websiteaktivit??ten und Anzeigen f??r die Websitebetreiber zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird Google diese Informationen gegebenenfalls an Dritte ??bertragen, sofern dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre IP-Adresse mit anderen Daten der Google in Verbindung bringen. Das Speichern von Cookies auf Ihrer Festplatte und die Anzeige von Web Beacons k??nnen Sie verhindern, indem Sie in Ihren Browser-Einstellungen ''keine Cookies akzeptieren'' w??hlen (Im MS Internet-Explorer unter ''Extras > Internetoptionen > Datenschutz > Einstellung''; im Firefox unter ''Extras > Einstellungen > Datenschutz > Cookies''); wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht s??mtliche Funktionen dieser Website voll umf??nglich nutzen k??nnen. Durch die Nutzung dieser Website erkl??ren Sie sich mit der Bearbeitung der ??ber Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.</p><br> 
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
    <h1>Datenschutzerkl??rung</h1>
    <h2 id="m14">Einleitung</h2>
    <p>Mit der folgenden Datenschutzerkl??rung m??chten wir Sie dar??ber aufkl??ren, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten??? bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerkl??rung
        gilt f??r alle von uns durchgef??hrten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepr??senzen, wie
        z.B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als "Onlineangebot???).</p>
    <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
    <p>Stand: 5. Mai 2022</p>
    <h2>Inhalts??bersicht</h2>
    <ul class="index">
        <li><a class="index-link" href="#m14">Einleitung</a></li>
        <li><a class="index-link" href="#m3">Verantwortlicher</a></li>
        <li><a class="index-link" href="#mOverview">??bersicht der Verarbeitungen</a></li>
        <li><a class="index-link" href="#m13">Ma??gebliche Rechtsgrundlagen</a></li>
        <li><a class="index-link" href="#m27">Sicherheitsma??nahmen</a></li>
        <li><a class="index-link" href="#m25">??bermittlung von personenbezogenen Daten</a></li>
        <li><a class="index-link" href="#m24">Datenverarbeitung in Drittl??ndern</a></li>
        <li><a class="index-link" href="#m12">L??schung von Daten</a></li>
        <li><a class="index-link" href="#m134">Einsatz von Cookies</a></li>
        <li><a class="index-link" href="#m225">Bereitstellung des Onlineangebotes und Webhosting</a></li>
        <li><a class="index-link" href="#m182">Kontakt- und Anfragenverwaltung</a></li>
        <li><a class="index-link" href="#m15">??nderung und Aktualisierung der Datenschutzerkl??rung</a></li>
        <li><a class="index-link" href="#m10">Rechte der betroffenen Personen</a></li>
        <li><a class="index-link" href="#m42">Begriffsdefinitionen</a></li>
    </ul>
    <h2 id="m3">Verantwortlicher</h2>
    <h2 id="mOverview">??bersicht der Verarbeitungen</h2>
    <p>Die nachfolgende ??bersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p>
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
    <h3 id="m13">Ma??gebliche Rechtsgrundlagen</h3>
    <p>Im Folgenden erhalten Sie eine ??bersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem
        Wohn- oder Sitzland gelten k??nnen. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen ma??geblich sein, teilen wir Ihnen diese in der Datenschutzerkl??rung mit.</p>
    <ul>
        <li><strong>Vertragserf??llung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO)</strong> - Die Verarbeitung ist f??r die Erf??llung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchf??hrung vorvertraglicher
            Ma??nahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.</li>
        <li><strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO)</strong> - Die Verarbeitung ist zur Erf??llung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.</li>
        <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO)</strong> - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten
            der betroffenen Person, die den Schutz personenbezogener Daten erfordern, ??berwiegen.</li>
    </ul>
    <p>Zus??tzlich zu den Datenschutzregelungen der Datenschutz-Grundverordnung gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu geh??rt insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz
        ??? BDSG). Das BDSG enth??lt insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf L??schung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung f??r andere Zwecke und zur ??bermittlung
        sowie automatisierten Entscheidungsfindung im Einzelfall einschlie??lich Profiling. Des Weiteren regelt es die Datenverarbeitung f??r Zwecke des Besch??ftigungsverh??ltnisses (?? 26 BDSG), insbesondere im Hinblick auf die Begr??ndung, Durchf??hrung oder
        Beendigung von Besch??ftigungsverh??ltnissen sowie die Einwilligung von Besch??ftigten. Ferner k??nnen Landesdatenschutzgesetze der einzelnen Bundesl??nder zur Anwendung gelangen.</p>
    <h2 id="m27">Sicherheitsma??nahmen</h2>
    <p>Wir treffen nach Ma??gabe der gesetzlichen Vorgaben unter Ber??cksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umst??nde und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten
        und des Ausma??es der Bedrohung der Rechte und Freiheiten nat??rlicher Personen geeignete technische und organisatorische Ma??nahmen, um ein dem Risiko angemessenes Schutzniveau zu gew??hrleisten.</p>
    <p>Zu den Ma??nahmen geh??ren insbesondere die Sicherung der Vertraulichkeit, Integrit??t und Verf??gbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe,
        der Sicherung der Verf??gbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die L??schung von Daten und Reaktionen auf die Gef??hrdung der Daten gew??hrleisten. Ferner ber??cksichtigen
        wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.</p>
    <p>SSL-Verschl??sselung (https): Um Ihre via unserem Online-Angebot ??bermittelten Daten zu sch??tzen, nutzen wir eine SSL-Verschl??sselung. Sie erkennen derart verschl??sselte Verbindungen an dem Pr??fix https:// in der Adresszeile Ihres Browsers.</p>
    <h2 id="m25">??bermittlung von personenbezogenen Daten</h2>
    <p>Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass die Daten an andere Stellen, Unternehmen, rechtlich selbstst??ndige Organisationseinheiten oder Personen ??bermittelt oder sie ihnen gegen??ber offengelegt werden. Zu den Empf??ngern
        dieser Daten k??nnen z.B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter von Diensten und Inhalten, die in eine Webseite eingebunden werden, geh??ren. In solchen Fall beachten wir die gesetzlichen Vorgaben und schlie??en insbesondere entsprechende
        Vertr??ge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empf??ngern Ihrer Daten ab.</p>
    <h2 id="m24">Datenverarbeitung in Drittl??ndern</h2>
    <p>Sofern wir Daten in einem Drittland (d.h., au??erhalb der Europ??ischen Union (EU), des Europ??ischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter oder der Offenlegung bzw. ??bermittlung
        von Daten an andere Personen, Stellen oder Unternehmen stattfindet, erfolgt dies nur im Einklang mit den gesetzlichen Vorgaben. </p>
    <p>Vorbehaltlich ausdr??cklicher Einwilligung oder vertraglich oder gesetzlich erforderlicher ??bermittlung verarbeiten oder lassen wir die Daten nur in Drittl??ndern mit einem anerkannten Datenschutzniveau, vertraglichen Verpflichtung durch sogenannte
        Standardschutzklauseln der EU-Kommission, beim Vorliegen von Zertifizierungen oder verbindlicher internen Datenschutzvorschriften verarbeiten (Art. 44 bis 49 DSGVO, Informationsseite der EU-Kommission: <a href="https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de"
            target="_blank">https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de</a>).</p>
    <h2 id="m12">L??schung von Daten</h2>
    <p>Die von uns verarbeiteten Daten werden nach Ma??gabe der gesetzlichen Vorgaben gel??scht, sobald deren zur Verarbeitung erlaubten Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen (z.B. wenn der Zweck der Verarbeitung dieser Daten
        entfallen ist oder sie f??r den Zweck nicht erforderlich sind).</p>
    <p>Sofern die Daten nicht gel??scht werden, weil sie f??r andere und gesetzlich zul??ssige Zwecke erforderlich sind, wird deren Verarbeitung auf diese Zwecke beschr??nkt. D.h., die Daten werden gesperrt und nicht f??r andere Zwecke verarbeitet. Das gilt z.B.
        f??r Daten, die aus handels- oder steuerrechtlichen Gr??nden aufbewahrt werden m??ssen oder deren Speicherung zur Geltendmachung, Aus??bung oder Verteidigung von Rechtsanspr??chen oder zum Schutz der Rechte einer anderen nat??rlichen oder juristischen
        Person erforderlich ist.</p>
    <p>Unsere Datenschutzhinweise k??nnen ferner weitere Angaben zu der Aufbewahrung und L??schung von Daten beinhalten, die f??r die jeweiligen Verarbeitungen vorrangig gelten.</p>
    <h2 id="m134">Einsatz von Cookies</h2>
    <p>Cookies sind kleine Textdateien, bzw. sonstige Speichervermerke, die Informationen auf Endger??ten speichern und Informationen aus den Endger??ten auslesen. Z.B. um den Login-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem E-Shop, die aufgerufenen
        Inhalte oder verwendete Funktionen eines Onlineangebotes speichern. Cookies k??nnen ferner zu unterschiedlichen Zwecken eingesetzt werden, z.B. zu Zwecken der Funktionsf??higkeit, Sicherheit und Komfort von Onlineangeboten sowie der Erstellung von
        Analysen der Besucherstr??me. </p>
    <p><strong>Hinweise zur Einwilligung: </strong>Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein. Daher holen wir von den Nutzern eine vorhergehende Einwilligung ein, au??er wenn diese gesetzlich nicht gefordert ist. Eine Einwilligung
        ist insbesondere nicht notwendig, wenn das Speichern und das Auslesen der Informationen, also auch von Cookies, unbedingt erforderlich sind, um dem den Nutzern einen von ihnen ausdr??cklich gew??nschten Telemediendienst (also unser Onlineangebot)
        zur Verf??gung zu stellen. Die widerrufliche Einwilligung wird gegen??ber den Nutzern deutlich kommuniziert und enth??lt die Informationen zu der jeweiligen Cookie-Nutzung.</p>
    <p><strong>Hinweise zu datenschutzrechtlichen Rechtsgrundlagen: </strong>Auf welcher datenschutzrechtlichen Rechtsgrundlage wir die personenbezogenen Daten der Nutzer mit Hilfe von Cookies verarbeiten, h??ngt davon ab, ob wir Nutzer um eine Einwilligung
        bitten. Falls die Nutzer einwilligen, ist die Rechtsgrundlage der Verarbeitung Ihrer Daten die erkl??rte Einwilligung. Andernfalls werden die mithilfe von Cookies verarbeiteten Daten auf Grundlage unserer berechtigten Interessen (z.B. an einem
        betriebswirtschaftlichen Betrieb unseres Onlineangebotes und Verbesserung seiner Nutzbarkeit) verarbeitet oder, wenn dies im Rahmen der Erf??llung unserer vertraglichen Pflichten erfolgt, wenn der Einsatz von Cookies erforderlich ist, um unsere
        vertraglichen Verpflichtungen zu erf??llen. Zu welchen Zwecken die Cookies von uns verarbeitet werden, dar??ber kl??ren wir im Laufe dieser Datenschutzerkl??rung oder im Rahmen von unseren Einwilligungs- und Verarbeitungsprozessen auf.</p>
    <p><strong>Speicherdauer:??</strong>Im Hinblick auf die Speicherdauer werden die folgenden Arten von Cookies unterschieden:</p>
    <ul>
        <li><strong>Tempor??re Cookies (auch: Session- oder Sitzungs-Cookies):</strong>??Tempor??re Cookies werden sp??testens gel??scht, nachdem ein Nutzer ein Online-Angebot verlassen und sein Endger??t (z.B. Browser oder mobile Applikation) geschlossen hat.</li>
        <li><strong>Permanente Cookies:</strong> Permanente Cookies bleiben auch nach dem Schlie??en des Endger??tes gespeichert. So k??nnen beispielsweise der Login-Status gespeichert oder bevorzugte Inhalte direkt angezeigt werden, wenn der Nutzer eine Website
            erneut besucht. Ebenso k??nnen die mit Hilfe von Cookies erhobenen Daten der Nutzer zur Reichweitenmessung verwendet werden. Sofern wir Nutzern??keine expliziten Angaben zur Art und Speicherdauer von Cookies mitteilen (z. B. im Rahmen der Einholung
            der Einwilligung), sollten Nutzer davon ausgehen, dass Cookies permanent sind und die Speicherdauer bis zu zwei Jahre betragen kann.</li>
    </ul>
    <p><strong>Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-Out): </strong>Nutzer k??nnen die von ihnen abgegebenen Einwilligungen jederzeit Widerrufen und zudem einen Widerspruch gegen die Verarbeitung entsprechend??den gesetzlichen Vorgaben im Art.
        21 DSGVO einlegen (weitere Hinweise zum Widerspruch erfolgen im Rahmen dieser Datenschutzerkl??rung). Nutzer k??nnen Ihren Widerspruch auch mittels der Einstellungen Ihres Browsers erkl??ren.</p>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Verarbeitung von Cookie-Daten auf Grundlage einer Einwilligung: </strong>Wir setzen ein Verfahren zum Cookie-Einwilligungs-Management ein, in dessen Rahmen die Einwilligungen der Nutzer in den Einsatz von Cookies, bzw. der im Rahmen des
            Cookie-Einwilligungs-Management-Verfahrens genannten Verarbeitungen und Anbieter eingeholt sowie von den Nutzern verwaltet und widerrufen werden k??nnen. Hierbei wird die Einwilligungserkl??rung gespeichert, um deren Abfrage nicht erneut wiederholen
            zu m??ssen und die Einwilligung entsprechend der gesetzlichen Verpflichtung nachweisen zu k??nnen. Die Speicherung kann serverseitig und/oder in einem Cookie (sogenanntes Opt-In-Cookie, bzw. mithilfe vergleichbarer Technologien) erfolgen, um
            die Einwilligung einem Nutzer, bzw. dessen Ger??t zuordnen zu k??nnen. Vorbehaltlich individueller Angaben zu den Anbietern von Cookie-Management-Diensten, gelten die folgenden Hinweise: Die Dauer der Speicherung der Einwilligung kann bis zu
            zwei Jahren betragen. Hierbei wird ein pseudonymer Nutzer-Identifikator gebildet und mit dem Zeitpunkt der Einwilligung, Angaben zur Reichweite der Einwilligung (z. B. welche Kategorien von Cookies und/oder Diensteanbieter) sowie dem Browser,
            System und verwendeten Endger??t gespeichert.</li>
    </ul>
    <h2 id="m225">Bereitstellung des Onlineangebotes und Webhosting</h2>
    <p>Um unser Onlineangebot sicher und effizient bereitstellen zu k??nnen, nehmen wir die Leistungen von einem oder mehreren Webhosting-Anbietern in Anspruch, von deren Servern (bzw. von ihnen verwalteten Servern) das Onlineangebot abgerufen werden kann.
        Zu diesen Zwecken k??nnen wir Infrastruktur- und Plattformdienstleistungen, Rechenkapazit??t, Speicherplatz und Datenbankdienste sowie Sicherheitsleistungen und technische Wartungsleistungen in Anspruch nehmen.</p>
    <p>Zu den im Rahmen der Bereitstellung des Hostingangebotes verarbeiteten Daten k??nnen alle die Nutzer unseres Onlineangebotes betreffenden Angaben geh??ren, die im Rahmen der Nutzung und der Kommunikation anfallen. Hierzu geh??ren regelm????ig die IP-Adresse,
        die notwendig ist, um die Inhalte von Onlineangeboten an Browser ausliefern zu k??nnen, und alle innerhalb unseres Onlineangebotes oder von Webseiten get??tigten Eingaben.</p>
    <ul class="m-elements">
        <li><strong>Verarbeitete Datenarten:</strong> Inhaltsdaten (z.B. Eingaben in Onlineformularen); Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten (z.B. Ger??te-Informationen, IP-Adressen).</li>
        <li><strong>Betroffene Personen:</strong> Nutzer (z.B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
        <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
        <li><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO).</li>
    </ul>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Wir selbst (bzw. unser Webhostinganbieter) erheben Daten zu jedem Zugriff auf den Server (sogenannte Serverlogfiles). Zu den Serverlogfiles k??nnen die Adresse und Name der abgerufenen Webseiten
            und Dateien, Datum und Uhrzeit des Abrufs, ??bertragene Datenmengen, Meldung ??ber erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende
            Provider geh??ren. Die Serverlogfiles k??nnen zum einen zu Zwecken der Sicherheit eingesetzt werden, z.B., um eine ??berlastung der Server zu vermeiden (insbesondere im Fall von missbr??uchlichen Angriffen, sogenannten DDoS-Attacken) und zum anderen,
            um die Auslastung der Server und ihre Stabilit??t sicherzustellen; <strong>L??schung von Daten:</strong> Logfile-Informationen werden f??r die Dauer von maximal 30 Tagen gespeichert und danach gel??scht oder anonymisiert. Daten, deren weitere
            Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endg??ltigen Kl??rung des jeweiligen Vorfalls von der L??schung ausgenommen.</li>
    </ul>
    <h2 id="m182">Kontakt- und Anfragenverwaltung</h2>
    <p>Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail, Telefon oder via soziale Medien) sowie im Rahmen bestehender Nutzer- und Gesch??ftsbeziehungen werden die Angaben der anfragenden Personen verarbeitet soweit dies zur Beantwortung der
        Kontaktanfragen und etwaiger angefragter Ma??nahmen erforderlich ist.</p>
    <p>Die Beantwortung der Kontaktanfragen sowie die Verwaltung von Kontakt- und Anfragedaten im Rahmen von vertraglichen oder vorvertraglichen Beziehungen erfolgt zur Erf??llung unserer vertraglichen Pflichten oder zur Beantwortung von (vor)vertraglichen
        Anfragen und im ??brigen auf Grundlage der berechtigten Interessen an der Beantwortung der Anfragen und Pflege von Nutzer- bzw. Gesch??ftsbeziehungen.</p>
    <ul class="m-elements">
        <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z.B. Namen, Adressen); Kontaktdaten (z.B. E-Mail, Telefonnummern); Inhaltsdaten (z.B. Eingaben in Onlineformularen).</li>
        <li><strong>Betroffene Personen:</strong> Kommunikationspartner.</li>
        <li><strong>Zwecke der Verarbeitung:</strong> Kontaktanfragen und Kommunikation; Erbringung vertraglicher Leistungen und Kundenservice.</li>
        <li><strong>Rechtsgrundlagen:</strong> Vertragserf??llung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO); Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO); Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c. DSGVO).</li>
    </ul>
    <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
    <ul class="m-elements">
        <li><strong>Kontaktformular: </strong>Wenn Nutzer ??ber unser Kontaktformular, E-Mail oder andere Kommunikationswege mit uns in Kontakt treten, verarbeiten wir die uns in diesem Zusammenhang mitgeteilten Daten zur Bearbeitung des mitgeteilten Anliegens.
            Zu diesem Zweck verarbeiten wir personenbezogene Daten im Rahmen vorvertraglicher und vertraglicher Gesch??ftsbeziehungen, soweit dies zu deren Erf??llung erforderlich ist und im ??brigen auf Grundlage unserer berechtigten Interessen sowie der
            Interessen der Kommunikationspartner an der Beantwortung der Anliegen und unserer gesetzlichen Aufbewahrungspflichten.</li>
    </ul>
    <h2 id="m15">??nderung und Aktualisierung der Datenschutzerkl??rung</h2>
    <p>Wir bitten Sie, sich regelm????ig ??ber den Inhalt unserer Datenschutzerkl??rung zu informieren. Wir passen die Datenschutzerkl??rung an, sobald die ??nderungen der von uns durchgef??hrten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie,
        sobald durch die ??nderungen eine Mitwirkungshandlung Ihrerseits (z.B. Einwilligung) oder eine sonstige individuelle Benachrichtigung erforderlich wird.</p>
    <p>Sofern wir in dieser Datenschutzerkl??rung Adressen und Kontaktinformationen von Unternehmen und Organisationen angeben, bitten wir zu beachten, dass die Adressen sich ??ber die Zeit ??ndern k??nnen und bitten die Angaben vor Kontaktaufnahme zu pr??fen.</p>
    <h2 id="m10">Rechte der betroffenen Personen</h2>
    <p>Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:</p>
    <ul>
        <li><strong>Widerspruchsrecht: Sie haben das Recht, aus Gr??nden, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch f??r ein auf diese Bestimmungen gest??tztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch f??r das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.</strong></li>
        <li><strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.</li>
        <li><strong>Auskunftsrecht:</strong> Sie haben das Recht, eine Best??tigung dar??ber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft ??ber diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen
            Vorgaben.
        </li>
        <li><strong>Recht auf Berichtigung:</strong> Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollst??ndigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.</li>
        <li><strong>Recht auf L??schung und Einschr??nkung der Verarbeitung:</strong> Sie haben nach Ma??gabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverz??glich gel??scht werden, bzw. alternativ nach Ma??gabe der gesetzlichen
            Vorgaben eine Einschr??nkung der Verarbeitung der Daten zu verlangen.</li>
        <li><strong>Recht auf Daten??bertragbarkeit:</strong> Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Ma??gabe der gesetzlichen Vorgaben in einem strukturierten, g??ngigen und maschinenlesbaren Format zu erhalten oder
            deren ??bermittlung an einen anderen Verantwortlichen zu fordern.</li>
        <li><strong>Beschwerde bei Aufsichtsbeh??rde:</strong> Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer Aufsichtsbeh??rde, insbesondere in dem Mitgliedstaat ihres gew??hnlichen
            Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts des mutma??lichen Versto??es, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die Vorgaben der DSGVO verst????t.</li>
    </ul>
    <h2 id="m42">Begriffsdefinitionen</h2>
    <p>In diesem Abschnitt erhalten Sie eine ??bersicht ??ber die in dieser Datenschutzerkl??rung verwendeten Begrifflichkeiten. Viele der Begriffe sind dem Gesetz entnommen und vor allem im Art. 4 DSGVO definiert. Die gesetzlichen Definitionen sind verbindlich.
        Die nachfolgenden Erl??uterungen sollen dagegen vor allem dem Verst??ndnis dienen. Die Begriffe sind alphabetisch sortiert.</p>
    <ul class="glossary">
        <li><strong>Personenbezogene Daten:</strong> "Personenbezogene Daten??? sind alle Informationen, die sich auf eine identifizierte oder identifizierbare nat??rliche Person (im Folgenden "betroffene Person???) beziehen; als identifizierbar wird eine nat??rliche
            Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z.B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert
            werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identit??t dieser nat??rlichen Person sind. </li>
        <li><strong>Verantwortlicher:</strong> Als "Verantwortlicher??? wird die nat??rliche oder juristische Person, Beh??rde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen ??ber die Zwecke und Mittel der Verarbeitung von personenbezogenen
            Daten entscheidet, bezeichnet. </li>
        <li><strong>Verarbeitung:</strong> "Verarbeitung" ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgef??hrte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch
            jeden Umgang mit Daten, sei es das Erheben, das Auswerten, das Speichern, das ??bermitteln oder das L??schen. </li>
    </ul>
    <p>
        <a href="https://datenschutz-generator.de/" title="Rechtstext von Dr. Schwenke - f??r weitere Informationen bitte anklicken." target="_blank" rel="noopener noreferrer nofollow"><img src="https://datenschutz-generator.de/wp-content/plugins/ts-dsg/images/dsg-seal/dsg-seal-pp-de.png" alt="Rechtstext von Dr. Schwenke - f??r weitere Informationen bitte anklicken." width="250" height="250"></a>
    </p>
    </div>   
    `;
}


// stop propagation

function doNotClose(event) {
    event.stopPropagation();
}


// reload page

function reload() {
    location.reload();
}