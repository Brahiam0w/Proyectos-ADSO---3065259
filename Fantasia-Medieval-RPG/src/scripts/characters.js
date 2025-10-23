// Datos de los personajes
const characterData = {
    // Elfos
    elfo1: {
        name: "Aethel Silvermoon",
        title: "Archimago de Quel'thalas",
        legion: "Magos de la Torre Plateada",
        race: "Elfo",
        lore: "Un poderoso archimago elfo que ha dedicado siglos al estudio de las artes arcanas. Su dominio sobre la magia élfica ancestral lo convierte en uno de los hechiceros más respetados de la Alianza.",
        abilities: [
            {
                name: "Nova Arcana",
                description: "Desata una explosión de energía mágica pura que daña y ralentiza a los enemigos."
            },
            {
                name: "Escudo de Cristal",
                description: "Crea una barrera mágica que refleja los hechizos enemigos."
            },
            {
                name: "Lluvia de Estrellas",
                description: "Invoca una lluvia de energía celestial que daña a los enemigos y cura a los aliados."
            }
        ]
    },
    elfo2: {
        name: "Lyandra Dawnweaver",
        title: "Guardiana del Bosque Eterno",
        legion: "Centinelas de la Luna",
        race: "Elfo",
        lore: "Una experta arquera y protectora de los bosques ancestrales. Su conexión con la naturaleza le permite moverse como una sombra entre los árboles.",
        abilities: [
            {
                name: "Flecha Lunar",
                description: "Dispara una flecha imbuida con la energía de la luna que atraviesa las defensas enemigas."
            },
            {
                name: "Velo Natural",
                description: "Se camufla con el entorno, volviéndose casi invisible."
            },
            {
                name: "Llamada del Bosque",
                description: "Invoca a las criaturas del bosque para que luchen a su lado."
            }
        ]
    },
    elfo3: {
        name: "Theron Starwhisper",
        title: "Sacerdote de la Luna",
        legion: "Clérigos de Elune",
        race: "Elfo",
        lore: "Un devoto sacerdote que canaliza el poder sagrado de Elune para sanar a sus aliados y castigar a los impíos.",
        abilities: [
            {
                name: "Bendición Lunar",
                description: "Otorga la bendición de Elune, aumentando el poder de curación."
            },
            {
                name: "Luz Purificadora",
                description: "Invoca luz sagrada que daña a los no-muertos y purifica la corrupción."
            },
            {
                name: "Manto de Elune",
                description: "Protege a los aliados con el poder de la luna."
            }
        ]
    },
    elfo4: {
        name: "Sylvanas Windrunner",
        title: "Capitana de los Forestales",
        legion: "Forestales de Plateada",
        race: "Elfo",
        lore: "Una estratega brillante y arquera excepcional que lidera a los forestales en la defensa de las tierras élficas.",
        abilities: [
            {
                name: "Disparo Múltiple",
                description: "Lanza varias flechas a la vez, atacando a múltiples objetivos."
            },
            {
                name: "Trampa de Hielo",
                description: "Coloca una trampa que congela a los enemigos que la pisen."
            },
            {
                name: "Señal de los Forestales",
                description: "Marca objetivos para que los aliados hagan más daño."
            }
        ]
    },
    // Enanos
    enano1: {
        name: "Thorin Steelbeard",
        title: "Señor de la Forja",
        legion: "Herreros de Forjaz",
        race: "Enano",
        lore: "Maestro herrero y guerrero, conocido por forjar las armas más poderosas de la Alianza y por su valentía en batalla.",
        abilities: [
            {
                name: "Golpe de Martillo",
                description: "Un poderoso golpe que aturde al enemigo y destruye su armadura."
            },
            {
                name: "Forja de Armas",
                description: "Mejora temporalmente las armas de los aliados cercanos."
            },
            {
                name: "Resistencia de la Montaña",
                description: "Aumenta la defensa y resistencia de todo el grupo."
            }
        ]
    },
    enano2: {
        name: "Moira Thaurissan",
        title: "Reina Regente",
        legion: "Clan Barbabronce",
        race: "Enano",
        lore: "Líder sabia y decidida que une a los clanes enanos bajo una sola bandera. Su dominio de la magia oscura y la política la hace única.",
        abilities: [
            {
                name: "Decreto Real",
                description: "Inspira a las tropas cercanas, aumentando su moral y fuerza."
            },
            {
                name: "Toque Sombrío",
                description: "Lanza una maldición que debilita a los enemigos."
            },
            {
                name: "Unidad de los Clanes",
                description: "Otorga diferentes beneficios según el clan enano más cercano."
            }
        ]
    },
    enano3: {
        name: "Bromm Ironfist",
        title: "Maestro de Rifles",
        legion: "Fusileros de Forjaz",
        race: "Enano",
        lore: "El mejor tirador de Forjaz, ha perfeccionado el arte de la ingeniería gnómica y el combate a distancia.",
        abilities: [
            {
                name: "Disparo Certero",
                description: "Un tiro preciso que causa daño crítico garantizado."
            },
            {
                name: "Granada de Fragmentación",
                description: "Lanza una granada que daña y ralentiza a los enemigos."
            },
            {
                name: "Modo Francotirador",
                description: "Aumenta el alcance y el daño de los disparos."
            }
        ]
    },
    enano4: {
        name: "Dagmar Stoneheart",
        title: "Guardián de las Runas",
        legion: "Guardianes de las Runas",
        race: "Enano",
        lore: "Custodio de los antiguos secretos rúnicos de los enanos. Su conocimiento de la magia rúnica lo hace indispensable en batalla.",
        abilities: [
            {
                name: "Runa de Poder",
                description: "Inscribe runas mágicas que aumentan el poder de las armas."
            },
            {
                name: "Barrera Rúnica",
                description: "Crea un campo de protección usando runas antiguas."
            },
            {
                name: "Explosión Rúnica",
                description: "Detona las runas cercanas causando daño masivo."
            }
        ]
    },
    // Humanos
    humano1: {
        name: "Marcus Shadowblade",
        title: "Maestro Asesino",
        legion: "Operativos de SI:7",
        race: "Humano",
        lore: "Espía maestro y asesino de élite al servicio de la Alianza. Sus misiones secretas han salvado al reino en innumerables ocasiones.",
        abilities: [
            {
                name: "Golpe Sombrío",
                description: "Un ataque sigiloso que causa daño crítico desde las sombras."
            },
            {
                name: "Veneno Paralizante",
                description: "Aplica un veneno que ralentiza y debilita al objetivo."
            },
            {
                name: "Evasión Táctica",
                description: "Desaparece en las sombras, evitando todo daño."
            }
        ]
    },
    humano2: {
        name: "Katarina Lightbringer",
        title: "Alta Inquisidora",
        legion: "Cruzada Escarlata",
        race: "Humano",
        lore: "Paladín devota que lidera la lucha contra las fuerzas de la oscuridad. Su fe es tan fuerte como su espada.",
        abilities: [
            {
                name: "Juicio Divino",
                description: "Un poderoso ataque que causa daño sagrado extra contra no-muertos."
            },
            {
                name: "Aura de Santidad",
                description: "Protege a los aliados del control mental y el miedo."
            },
            {
                name: "Martillo de la Justicia",
                description: "Aturde al objetivo y lo marca con luz sagrada."
            }
        ]
    },
    humano3: {
        name: "Gabriel Brightweave",
        title: "Archimago de Dalaran",
        legion: "Kirin Tor",
        race: "Humano",
        lore: "Uno de los magos más poderosos de Dalaran, especializado en manipular el tiempo y el espacio.",
        abilities: [
            {
                name: "Distorsión Temporal",
                description: "Ralentiza el tiempo para los enemigos."
            },
            {
                name: "Portal Arcano",
                description: "Crea portales para transportar tropas rápidamente."
            },
            {
                name: "Explosión de Poder",
                description: "Libera una oleada de energía arcana pura."
            }
        ]
    },
    humano4: {
        name: "Elena Stormwind",
        title: "Capitana de la Guardia",
        legion: "Guardia de Stormwind",
        race: "Humano",
        lore: "Líder táctica y estratega brillante que ha defendido Stormwind de innumerables amenazas.",
        abilities: [
            {
                name: "Grito de Guerra",
                description: "Aumenta la moral y la fuerza de las tropas cercanas."
            },
            {
                name: "Formación Defensiva",
                description: "Organiza a los aliados en una formación que aumenta su defensa."
            },
            {
                name: "Carga Heroica",
                description: "Lidera una carga que daña y aturde a los enemigos en línea."
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const characterModal = document.getElementById('characterModal');
    const panelPortrait = document.getElementById('panelPortrait');
    const panelName = document.getElementById('panelName');
    const panelTitle = document.getElementById('panelTitle');
    const panelLore = document.getElementById('panelLore');
    const panelAbilities = document.getElementById('panelAbilities');
    const panelSelect = document.getElementById('panelSelect');
    const closeModal = document.getElementById('closeModal');

    let selectedCharacter = null;

    // Función para mostrar el modal
    function showModal() {
        characterModal.classList.remove('hidden');
        characterModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    // Función para ocultar el modal
    function hideModal() {
        characterModal.classList.add('hidden');
        characterModal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    function renderPanel(characterId) {
        const character = characterData[characterId];
        if (!character) return;

        const cardImg = document.querySelector(`[data-character="${characterId}"] img`);
        panelPortrait.src = cardImg ? cardImg.src : '';
        panelName.textContent = character.name;
        panelTitle.textContent = character.title;
        panelLore.textContent = character.lore;

        // Render abilities
        panelAbilities.innerHTML = '';
        character.abilities.forEach(ability => {
            const ab = document.createElement('div');
            ab.className = 'bg-[#001428]/50 p-4 rounded-xl border border-[#ffd700]/10';
            ab.innerHTML = `
                <div class="flex flex-col gap-2">
                    <h4 class="text-base font-semibold text-[#ffd700]">${ability.name}</h4>
                    <p class="text-sm text-white/80 leading-relaxed">${ability.description}</p>
                </div>
            `;
            panelAbilities.appendChild(ab);
        });
    }

    function clearPanel() {
        panelPortrait.src = '';
        panelName.textContent = 'Selecciona un campeón';
        panelTitle.textContent = 'Título';
        panelLore.textContent = 'Las características del personaje aparecerán aquí al seleccionarlo';
        panelAbilities.innerHTML = '';
        selectedCharacter = null;
    }

    // Agregar event listeners a las tarjetas de personajes
    // Event listeners
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const characterId = card.dataset.character;
            selectedCharacter = characterId;
            renderPanel(characterId);
            showModal();
            // marcar visualmente la tarjeta seleccionada
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // Cerrar modal con el botón X
    closeModal.addEventListener('click', () => {
        hideModal();
    });

    // Cerrar modal al hacer clic fuera
    characterModal.addEventListener('click', (e) => {
        if (e.target === characterModal) {
            hideModal();
        }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    panelSelect.addEventListener('click', () => {
        if (!selectedCharacter) {
            alert('Selecciona primero un personaje.');
            return;
        }
        window.location.href = `/playPage?character=${selectedCharacter}`;
    });

    // Inicializar
    clearPanel();
});