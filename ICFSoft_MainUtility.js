//=============================================================================
// ICF-Soft Plugins - Main Utility
// ICFSoft_MainUtility.js
//=============================================================================

var Imported = Imported || {};
Imported.ICFSoft_MainUtility = true;

var ICF = ICF || {};
ICF.MainUtility = ICF.MainUtility || {};
ICF.NotetagsProcessor = ICF.NotetagsProcessor || {};

ICF.MainUtility.Version = 104; // 1.04

//=============================================================================
 /*:
 * @plugindesc v1.04b A sdk plugin with a lot of utilities for game
 * and plugin developers.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param Trait Blocks
 * @desc Make external blocks of traits for diverse pourposes.
 * @type note[]
 * @default []
 *
 * @param Effect Blocks
 * @desc Make external blocks of effects for diverse pourposes.
 * @type note[]
 * @default []
 *
 * @help
 * ============================================================================
 * Introduction
 * 
 * This is a sdk plugin with a lot of utilities to script easier.
 * It's needed for the mayority of my plugins to work.
 * 
 * It includes:
 *  -Special json feature to edit/add data fields.
 *  -Special trait system allowing to add traits to non-trait data (skills
 *      and items), add actor/enemy traits ingame plus a subtraits system.
 *  -Special effects system allowing to add effects to non-effect data (actors,
 *      classes, enemies...) plus a subeffects system.
 *  -Self and battle switchs/variables system.
 *  -Tags system.
 *  -Javascript runing system.
 *  -Extended features for some js built-in objects.
 * 
 * ============================================================================
 * How to use
 * ============================================================================
 * 
 * It uses notetags to add/alter data.
 * For plugin developers it's recommended to show how to use these tags
 * inside your plugins.
 * 
 * 
 * Json master tag allow to alter data in a particular way. You
 * can add new fields or edit out of field limits, it works in
 * json notation, better than just meta-tags.
 * 
 * Use every line between open and close tags to edit a field, first
 * field name followed by a two dots symbol, then one space and the
 * code in json format.
 * 
 * Example:
 *
 * <JSON MASTER>
 * gold: 50000000
 * hands_power: [50,100]
 * grade: 'F'
 * </JSON MASTER>
 * 
 *
 * Traits master tag allow to add traits througth notebox.
 * Every line between open and close tags are three numbers separated
 * by spaces. It is recomended to use the three numbers even if specified
 * trait uses only two, next inline place can be used for comments.
 * You can use a name instead of first number (see readme for all names).
 * 
 * Example:
 * 
 * <TRAITS MASTER>
 * elem_rate 1 1.5
 * 21 1 2
 * 31 2 0 -Attack element
 * </TRAITS MASTER>
 * 
 * 
 * Subtraits master tag allow to add more trait setups for different
 * uses like subclass traits, random enemy/item/equipment traits,
 * alter states tiers and so on. It works like traits master but you
 * dont't need to close tag every time you open a new subtrait setup.
 * 
 * Example:
 * 
 * <SUBTRAITS MASTER> -Fire slime
 * elem_rate 1 1.5
 * 11 2 0.5
 * 31 2 0 -Fire attack element
 * <SUBTRAITS MASTER> -Cold slime
 * elem_rate 1 1.5
 * 11 2 2.1
 * 31 3 0 -Cold attack element
 * </SUBTRAITS MASTER>
 * 
 * Note: More than one plugin can use subtraits in same data for different
 * purposes so you must provide a way to use specific blocks, something
 * like "<MyAmacingPluginSubtraits first last>" can be usefull.
 * 
 * To access a subtrait setup use 'item.subtraits[i].traits' instead of
 * 'item.traits', where 'i' is the index.
 * And for trait items use 'item.subtraits[i]' instead of 'item'.
 * 
 * Effects master and Subeffects master tags work like traits/subtraits
 * ones but are used for effects and effect setups, and need four numbers.
 * You can use a name instead of first number (see readme for all names
 * and how to use).
 * 
 * Examples:
 * 
 * <EFFECTS MASTER>
 * recover_hp 0 0.5 50
 * gain_tp 0 10 0
 * </EFFECTS MASTER>
 * 
 * <SUBEFFECTS MASTER>
 * recover_mp 0 0.5 50
 * gain_tp 0 5 0
 * <SUBEFFECTS MASTER>
 * recover_hp 0 0.5 50
 * gain_tp 0 10 0
 * </SUBEFFECTS MASTER>
 * 
 * 
 * JSEval master tag allow to add javascript code that can be run
 * when a condition is given or diverse pourposes.
 * You can give single key, double key or more, and you dont't need
 * to close tag every time you open a new code.
 * 
 * Example:
 * 
 * <JSEVAL MASTER A>
 * this.gainTp(15);
 * <JSEVAL MASTER A B>
 * if (this == subject) this.gainMp(-10);
 * v.setValue(10, v.value(10) + 2);
 * </JSEVAL MASTER>
 * 
 * Some variables are passed and can be used inside code:
 *   - subject: the subject of the action.
 *   - item: the object used in the action. Can be an item or a skill.
 *   - isSkill: check if is an skill.
 * 
 * 
 * You can add special tags for different pourposes with this:
 * 
 * <TAGS tag1 tag2>
 * 
 * Tags are divided into three groups based on where are.
 *   - Base tags are those inherited from actors and enemies
 *     (actors, classes, enemies and ingame given tags).
 *   - Other tags are those that can be attached (states, armors
 *     weapons...).
 *   - Battle tags are those that can be given in battle, are avaiable
 *     in battle and reset every battle. These are merged inside
 *     second group.
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * 
 * Trait Blocks: Allow to create external traits subgroups.
 * Is configured like the content between trait master tags.
 * Blocks are accesible with ICF.Param.subTraits[i] with i as a numerical index.
 *
 * Effect Blocks: Allow to create external effects subgroups.
 * Is configured like the content between effect master tags.
 * Blocks are accesible with ICF.Param.subEffects[i] with i as a numerical
 * index.
 * 
 * ============================================================================
 * Battle Switches and Variables
 * ============================================================================
 * 
 * These are new reciclable switches an variables that are reset every
 * battle. Are usefull in battle and help making battle steps without
 * touching persistent switches or variables.
 * 
 * Can be usefull for plugins that affect battles.
 * 
 * See readme file for more info.
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * selfswitch x true/false
 * mapswitch x true/false
 * actorswitch actorid x true/false
 * enemyswitch enemyid x true/false
 * battleswitch x true/false
 * actorbattleswitch actorid x true/false
 * enemybattleswitch enemyposition x true/false
 * 
 *  - Turns on/off specified selfswitch or mapswitch.
 *    You can also use an actorswitch and battle ones.
 * 
 * remoteswitch mapid eventid x true/false
 * 
 *  - Turns on/off specified selfswitch or mapswitch remotely.
 *    Use eventid 0 for a mapswitch.
 * 
 * selfvariable x value
 * mapvariable x value
 * actorvariable actorid x value
 * enemyvariable enemyid x value
 * battlevariable x value
 * actorbattlevariable actorid x value
 * enemybattlevariable enemyposition x value
 * 
 *  - Changes value of specified selfvariable or mapvariable.
 *    You can also use an actorvariable.
 *    You can put increase/multiply/divide/mod prefix.
 * 
 * remotevariable mapid eventid x value
 * 
 *  - Changes value of specified selfvariable or mapvariable remotely.
 *    Use eventid 0 for a mapvariable.
 *    You can put increase/multiply/divide/mod prefix.
 * 
 * actortraitadd actorid code id value
 * partymembertraitadd actorpos code id value
 * enemytraitadd enemy code id value
 * 
 *  - Adds an ingame trait to specified actor, actor in party or
 *    in battle enemy.
 *    Doesn't check for repeated traits (same code and id).
 * 
 * actortrait actorid code id value
 * partymembertrait actorpos code id value
 * enemytrait enemy code id value
 * 
 *  - Ensures an ingame trait to specified actor, actor in party or
 *    in battle enemy. If there isn't it'll be added, if there is at least
 *    one it'll be replaced and all repeated traits will be removed.
 * 
 * actortraitplus actorid code id value
 * partymembertraitplus actorpos code id value
 * enemytraitplus enemy code id value
 * 
 *  - Increase existing ingame trait to specified actor, actor in party or
 *    in battle enemy by a value. If there isn't it'll be added, and
 *    every repeated trait will be merged togeder by sum.
 * 
 * actortraitrate actorid code id value
 * partymembertraitrate actorpos code id value
 * enemytraitrate enemy code id value
 * 
 *  - Multiply existing ingame trait to specified actor, actor in party or
 *    in battle enemy by a value. If there isn't it'll be added, and
 *    every repeated trait will be merged togeder by multiplication.
 * 
 * removeactortrait actorid code id
 * removepartymembertrait actorpos code id
 * removeenemytraitenemy code id
 * 
 *  - Remove all ingame traits with specified code and id to specified actor,
 *    actor in party or in battle enemy.
 * 
 * clearactortraits actorid
 * clearpartymembertraits actorpos
 * clearenemytraits enemy
 * 
 *  - Remove all ingame traits to specified actor, actor in party or in
 *    battle enemy.
 * 
 * addactortag actorid tag
 * addpartymembertag actorposition tag
 * addenemytag enemypos tag
 * 
 *  - Add ingame tags to specified actor, actor in party or in battle
 *    enemy. You can add all tags you want in a single line.
 * 
 * removeactortag actorid tag
 * removepartymember actorposition tag
 * removeenemy enemypos tag
 * 
 *  - Remove ingame tags to specified actor, actor in party or in battle
 *    enemy. You can place all tags you want to remove in a single line.
 * 
 * clearactortag actorid tag
 * clearpartymember actorposition tag
 * clearenemy enemypos tag
 * 
 *  - Remove all ingame tags to specified actor, actor in party or in
 *    battle enemy.
 * 
 * By changing addactortag to addactorbattletag you can give battletags.
 * Can be applied to all tag commands.
 * 
 * ============================================================================
 * Scripting functions
 * ============================================================================
 *
 * Scripting functions are more complex. Read readme file.
 *
 * ============================================================================
 * Incompatibilities
 * ============================================================================
 * 
 * There's no known incompatible plugins yet.
 * 
 * ============================================================================
 * Known isues
 * ============================================================================
 * 
 * Not yet.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.04:
 * - Added external blocks for traits and effects.
 * - Improved tags system.
 * - Allow to filter selfswitches and variables.
 *
 * Version 1.03:
 * - Added tags system.
 *
 * Version 1.02:
 * - Extended battle and self switches and variables to all actors/enemies.
 * - Added group effect system.
 * - Improved trait system.
 *
 * Version 1.01:
 * - Added battle switches and variables.
 * - Added eval system.
 * - Added more js functions.
 *
 * Version 1.00:
 * - Finished plugin!
 * 
 * ============================================================================
 * 
 * For commercial and non-commercial games.
 * Credit to ICF-Soft.
 * Any plugin that needs this to work must add a clausule to say that ICF-Soft
 * must be included in credits page.
 * This entire header and plugin readme files must be included with plugin.
 * 
 * ============================================================================
*/
//=============================================================================
 /*:es
 * @plugindesc v1.04b Librería sdk con muchas utilidades para desarrolladores
 * de juegos y complementos.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param Trait Blocks
 * @desc Permite crear bloques externos de rasgos para diversos propósitos.
 * @type note[]
 * @default []
 *
 * @param Effect Blocks
 * @desc Permite crear bloques externos de efectos para diversos propósitos.
 * @type note[]
 * @default []
 *
 * @help
 * ============================================================================
 * Introducción
 * ============================================================================
 * 
 * Este complemento es una librería sdk con un montón de utilidades para
 * programar más fácil.
 * Es necesario para la mayoría de mis complementos.
 * 
 * Incluye:
 *  -Sistema json para editar/añadir campos.
 *  -sistema especial de características que permite añadir características
 *      en datos que normalmente no tienen (habilidades y objetos), añadir
 *      características a los personajes y enemigos durante el juego y un
 *      sistema especial de subcaracterísticas.
 *  -Sistema especial de efectos que permite añadir efectos en datos que
 *      normalmente no tienen (actoers, clases, enemigos...) y un sistema
 *      especial de sub-efectos.
 *  -Sistema de interruptores y variables locales y de batalla.
 *  -Sistema de etiquetas.
 *  -Sistema de ejecución de código javascript.
 *  -Funciones extra para algunos objetos predefinidos de javascript.
 * 
 * ============================================================================
 * Uso
 * ============================================================================
 * 
 * Para añadir o editar datos se utilizan las etiquetas en las notas.
 * Para desarrolladores de plugins se recomienda que se muestre cómo usarlas
 * en sus plugins.
 * 
 * 
 * La etiqueta 'Json master' permite alterar los datos de un modo particular.
 * Puedes añadir nuevos campos o editarlos sin las restricciones predeterminadas,
 * funciona en notación json, mejor que las simples etiquetas meta.
 * 
 * Utiliza cada linea entre las etiquetas de abertura y cierre para editar
 * un campo, primero el nombre del campo, luego dos puntos, un espacio y el
 * código en formato json.
 * 
 * Ejemplo:
 *
 * <JSON MASTER>
 * gold: 50000000
 * hands_power: [50,100]
 * alias: 'Romistrugio'
 * </JSON MASTER>
 * 
 *
 * La etiqueta 'Traits master' permite añadir características o rasgos.
 * En cada linea entre las etiquetas de apertura y cierre van tres números
 * separados por espacios. Se recomienda usar los tres aún cuando el rasgo
 * solo necesite dos, puedes continuar la linea con comentarios.
 * Puedes usar un nombre en lugar del primer número (en el archivo leeme
 * puedes encontrar todos los disponibles).
 * 
 * Ejemplo:
 * 
 * <TRAITS MASTER>
 * elem_rate 1 1.5
 * 21 1 2
 * 31 2 0 -Elemento de ataque
 * </TRAITS MASTER>
 * 
 * 
 * La etiqueta 'Subtraits master' permite añadir conjuntos de rasgos para
 * diferentes usos tales como rasgos de subclase, rasgos aleatorios para
 * enemigos/objetos/armas, fases de un estado alterado y más.
 * Funciona como la etiqueta anterior pero no necesitas cerrar antes de abrir
 * un nuevo subconjunto.
 * 
 * Ejemplo:
 * 
 * <SUBTRAITS MASTER> -Limo de fuego
 * elem_rate 1 1.5
 * 11 2 0.5
 * 31 2 0 -Ataca con fuego
 * <SUBTRAITS MASTER> -Limo de hielo
 * elem_rate 1 1.5
 * 11 2 2.1
 * 31 3 0 -Ataca con hielo
 * </SUBTRAITS MASTER>
 * 
 * Nota: Varios complementos pueden usar subconjuntos para las mismas tablas
 * de la base de datos para diferentes propósitos, de modo que debes
 * proveer un modo de usar subconjuntos específicos, por ejemplo algo así
 * como "<MiIncreiblePluginSubtraits primero ultimo>" podría ser útil.
 * 
 * Para acceder a un subconjunto se utiliza 'item.subtraits[i].traits' en
 * lugar de 'item.traits', donde 'i' es el índice.
 * Y para el objeto del subconjunto usar 'item.subtraits[i]' en lugar de 'item'.
 * 
 * 
 * Las etiquetas 'Effects master' y 'Subeffects master' funcionan de un modo
 * similar a las traits/subtraits pero se usan para efectos sus grupos.
 * Estas requieren el uso de cuatro números.
 * Puedes usar un nombre en lugar del primer número (en el archivo leeme
 * puedes encontrar todos los disponibles).
 * 
 * Ejemplos:
 * 
 * <EFFECTS MASTER>
 * recover_hp 0 0.5 50
 * gain_tp 0 10 0
 * </EFFECTS MASTER>
 * 
 * <SUBEFFECTS MASTER>
 * recover_mp 0 0.5 50
 * gain_tp 0 5 0
 * <SUBEFFECTS MASTER>
 * recover_hp 0 0.5 50
 * gain_tp 0 10 0
 * </SUBEFFECTS MASTER>
 * 
 * 
 * La etiqueta 'JSEval master' permite añadir código javascript que se
 * ejecutará en condiciones específicas o diversos propósitos.
 * Se puede hacer de una clave, dos o las que hagan falta, y no hace falta
 * cerrar la etiqueta cuando se ponen consecutivas.
 * 
 * Ejemplo:
 * 
 * <JSEVAL MASTER A>
 * this.gainTp(15);
 * <JSEVAL MASTER A B>
 * if (this == subject) this.gainMp(-10);
 * v.setValue(10, v.value(10) + 2);
 * </JSEVAL MASTER>
 * 
 * Hay algunas variables a las que se puede acceder dentro del código:
 *   - subject: el sujeto de la acción.
 *   - item: el objeto usado en la acción. Puede ser un objeto o habilidad.
 *   - isSkill: comprueba si se trata de una habilidad.
 * 
 * 
 * Puedes añadir etiquetas para diferentes propósitos con:
 * 
 * <TAGS tag1 tag2>
 * 
 * Las etiquetas se dividen en tres grupos en base a su origen.
 *   - Las base son las que son própias de los personajes y enemigos
 *     (actores, clases, enemigos y las añadidas mediante comando).
 *   - Las demás son las añadidas mediante estados alterados y equipamiento.
 *   - Las de batalla son las que se añaden durante el combate, solo
 *     son accesibles ahí y se reinician cada combate. Se añaden al segundo
 *     grupo.
 * 
 * ============================================================================
 * Parámetros
 * ============================================================================
 * 
 * Trait Blocks: Permite crear subgrupos externos de rasgos.
 * Se configura del mismo modo que el contenido interno de las etiquetas
 * trait master.
 * Se puede acceder mediante ICF.Param.subTraits[i] con i como índice numérico.
 *
 * Effect Blocks: Permite crear subgrupos externos de efectos.
 * Se configura del mismo modo que el contenido interno de las etiquetas
 * effect master.
 * Se puede acceder mediante ICF.Param.subEffects[i] con i como índice numérico.
 * 
 * ============================================================================
 * Interruptores y Variables de Batalla
 * ============================================================================
 * 
 * Son nuevos interruptores y variables reciclables que se reinician en
 * cada batalla. Útiles para dividir la batalla en fases sin tocar otros
 * interruptores o variables.
 * 
 * Muy útiles para plugins que afectan las batallas.
 * 
 * Para más información ver el archivo leeme.
 * 
 * ============================================================================
 * Comandos de complemento
 * ============================================================================
 * 
 * selfswitch x true/false
 * mapswitch x true/false
 * actorswitch actorid x true/false
 * enemyswitch enemyid x true/false
 * battleswitch x true/false
 * actorbattleswitch actorid x true/false
 * enemybattleswitch enemyposition x true/false
 * 
 *  - Activa o desactiva el autointerruptor, interruptor de mapa
 *    o de personaje.
 * 
 * remoteswitch mapid eventid x true/false
 * 
 *  - Activa o desactiva el autointerruptor o interruptor de mapa específico
 *    de forma remota. Usar eventid 0 para interruptor de mapa.
 * 
 * selfvariable x value
 * mapvariable x value
 * actorvariable actorid x value
 * enemyvariable enemyid x value
 * battlevariable x value
 * actorbattlevariable actorid x value
 * enemybattlevariable enemyposition x value
 * 
 *  - Cambia el valor de la variable de evento, mapa o personaje.
 *    Se pueden añadir los prefijos increase/multiply/divide/mod.
 * 
 * remotevariable mapid eventid x value
 * 
 *  - Cambia el valor de la variable de evento o mapa específico
 *    de forma remota. Usar eventid 0 para interruptor de mapa.
 *    Se pueden añadir los prefijos increase/multiply/divide/mod.
 * 
 * actortraitadd actorid code id value
 * partymembertraitadd actorpos code id value
 * enemytraitadd enemy code id value
 * 
 *  - Añade un rasgo dentro del juego para el personaje, personaje del
 *    grupo o enemigo.
 *    No comprueba si existen repetidos (mismos code e id).
 * 
 * actortrait actorid code id value
 * partymembertrait actorpos code id value
 * enemytrait enemy code id value
 * 
 *  - Asegura un rasgo dentro del juego para el personaje, personaje del
 *    grupo o enemigo. Si no hay se añade, si hay almenos uno se
 *    sobreescribe y el resto se elimina.
 * 
 * actortraitplus actorid code id value
 * partymembertraitplus actorpos code id value
 * enemytraitplus enemy code id value
 * 
 *  - Incrementa un rasgo dentro del juego para el personaje, personaje del
 *    grupo o enemigo. Si no hay se añade, si hay almenos uno se
 *    todos los que tenga se combinan mediante suma.
 * 
 * actortraitrate actorid code id value
 * partymembertraitrate actorpos code id value
 * enemytraitrate enemy code id value
 * 
 *  - Multiplica un rasgo dentro del juego para el personaje, personaje del
 *    grupo o enemigo. Si no hay se añade, si hay almenos uno se
 *    todos los que tenga se combinan mediante multiplicación.
 * 
 * removeactortrait actorid code id
 * removepartymembertrait actorpos code id
 * removeenemytraitenemy code id
 * 
 *  - Elimina todos los rasgos dentro del juego con código e id específicos
 *    del personaje, personaje del grupo o enemigo.
 * 
 * clearactortraits actorid
 * clearpartymembertraits actorpos
 * clearenemytraits enemy
 * 
 *  - Elimina todos los rasgos dentro del juego del personaje, personaje
 *    del grupo o enemigo.
 * 
 * addactortag actorid tag
 * addpartymembertag actorposition tag
 * addenemytag enemypos tag
 * 
 *  - Añade etiquetas durante el juego a un personaje, personaje del
 *    grupo o enemigo. Puedes poner varias en una misma linea.
 * 
 * removeactortag actorid tag
 * removepartymember actorposition tag
 * removeenemy enemypos tag
 * 
 *  - Elimina etiquetas durante el juego a un personaje, personaje del
 *    grupo o enemigo previamente añadidas. Puedes eliminar varias en
 *    una misma linea.
 * 
 * clearactortag actorid tag
 * clearpartymember actorposition tag
 * clearenemy enemypos tag
 * 
 *  - Elimina todas etiquetas añadidas durante el juego a un personaje,
 *    personaje del grupo o enemigo.
 * 
 * Cambiando addactortag por addactorbattletag puedes usar etiquetas de
 * batalla. Para cualquier comando de etiquetas.
 * 
 * ============================================================================
 * Funciones de script
 * ============================================================================
 *
 * Las funciones de script son más complejas. Ver archivo léeme..
 *
 * ============================================================================
 * Incompatibilidades
 * ============================================================================
 * 
 * No se conocen complementos que sean incompatibles hasta la fecha.
 * 
 * ============================================================================
 * Problemas conocidos
 * ============================================================================
 * 
 * Por el momento ninguno.
 * 
 * ============================================================================
 * Historial de versiones
 * ============================================================================
 *
 * Versión 1.04:
 * - Se han añadido bloques externos de rasgos y efectos.
 * - Se ha mejorado sistema de etiquetas.
 * - Permite filtrar los interruptores y variables locales.
 *
 * Versión 1.03:
 * - Se ha añadido un sistema de etiquetas.
 *
 * Versión 1.02:
 * - Se han extendido los interruptores y variables locales y de batalla a
 *   todos los personajes y enemigos.
 * - Se ha añadido sistema de efectos y grupos de efectos.
 * - Se ha mejorado el sistema de rasgos.
 *
 * Versión 1.01:
 * - Se han añadido interruptores y variables de batalla.
 * - Se han añadido funciones evaluables.
 * - Se han añadido más funciones extra.
 *
 * Versión 1.00:
 * - Complemento terminado.
 * 
 * ============================================================================
 * 
 * Para juegos comerciales y no comerciales.
 * Se debe incluir a ICF-Soft en los créditos.
 * Cualquier plugin que necesite este para funcionar debe incluir una cláusula
 * que indique que se debe incluir a ICF-Soft en los créditos.
 * Esta cabecera y los archivos leeme del complemento deben incluirse
 * íntegramente con el plugin.
 * 
 * ============================================================================
*/
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

ICF.Parameters = PluginManager.parameters('ICFSoft_MainUtility');
ICF.Param = ICF.Param || {};

ICF.Param.subTraits = [];
ICF.temp = JSON.parse(ICF.Parameters['Trait Blocks']);
for (var i = 0; i < ICF.temp.length; i++) {
    ICF.Param.subTraits[i] = JSON.parse(ICF.temp[i]);
}

ICF.Param.subEffects = [];
ICF.temp = JSON.parse(ICF.Parameters['Effect Blocks']);
for (var i = 0; i < ICF.temp.length; i++) {
    ICF.Param.subEffects[i] = JSON.parse(ICF.temp[i]);
}

//=============================================================================
// Constants
//=============================================================================

ICF.MainUtility.traittags = [
    ['elem_rate', 11, 0],
    ['debuffrate', 12, 0],
    ['ndebuffrate', 12, 10],
    ['state_rate', 13, 0],
    ['state_resist', 14, 0],
    ['skill_rate', 15, 0],
    ['itemdamage_rate', 15, 2000],
    ['weapon_rate', 16, 0],
    ['elem_absorb', 17, 0],
    ['elem_curse', 18, 0],
    ['elem_reflect', 19, 0],
    ['paramplus', 21, 10],
    ['paramrate', 21, 0],
    ['paramflat', 21, 20],
    ['paramxrate', 21, 30],
    ['paramxflat', 21, 40],
    ['xparamplus', 22, 0],
    ['xparamrate', 22, 10],
    ['xparamflat', 22, 20],
    ['sparamplus', 23, 10],
    ['sparamrate', 23, 0],
    ['sparamflat', 23, 20],
    ['nparamplus', 24, 0],
    ['nparamrate', 24, 100],
    ['nparamflat', 24, 200],
    ['nparamxrate', 24, 300],
    ['nparamxflat', 24, 400],
    ['pparamplus', 25, 0],
    ['pparamrate', 25, 100],
    ['pparamflat', 25, 200],
    ['cparamplus', 26, 0],
    ['cparamrate', 26, 100],
    ['cparamflat', 26, 200],
    ['cparamxrate', 26, 300],
    ['cparamxflat', 26, 400],
    ['tpplus', 27, 0],
    ['tprate', 27, 1],
    ['tpflat', 27, 2],
    ['tpxrate', 27, 3],
    ['tpxflat', 27, 4],
    ['attack_elem', 31, 0],
    ['attack_state', 32, 0],
    ['attack_speed', 33, 0],
    ['attack_times', 34, 0],
    ['attack_weapon', 35, 0],
    ['elem_enhace', 36, 0],
    ['skill_enhace', 36, 2000],
    ['weapon_enhace', 36, 4000],
    ['itemdamage_enhace', 36, 6000],
    ['stypeadd', 41, 0],
    ['stypeseal', 42, 0],
    ['skilladd', 43, 0],
    ['skillseal', 44, 0],
    ['equipweapon', 51, 0],
    ['equiparmor', 52, 0],
    ['equiplock', 53, 0],
    ['equipseal', 54, 0],
    ['slot_type', 55, 0],
    ['action_plus', 61, 0],
    ['special_flag', 62, 0],
    ['collapse_type', 63, 0],
    ['party_ability', 64, 0]
];

ICF.MainUtility.effecttags = [
    ['recover_hp', 11, 0],
    ['recover_mp', 12, 0],
    ['gain_tp', 13, 0],
    ['add_state', 21, 0],
    ['remove_state', 22, 0],
    ['add_buff', 31, 0],
    ['add_debuff', 32, 0],
    ['remove_buff', 33, 0],
    ['remove_debuff', 34, 0],
    ['add_nbuff', 35, 0],
    ['add_ndebuff', 36, 0],
    ['remove_nbuff', 37, 0],
    ['remove_ndebuff', 38, 0],
    ['add_cbuff', 35, 100],
    ['add_cdebuff', 36, 100],
    ['remove_cbuff', 37, 100],
    ['remove_cdebuff', 38, 100],
    ['special', 41, 0],
    ['grow', 42, 0],
    ['learn_skill', 43, 0],
    ['common_event', 44, 0],
    ['ngrow', 45, 0]
    ['pgrow', 46, 0]
    ['cgrow', 47, 0]
];

//=============================================================================
// Game_SelfSwitches
//=============================================================================

Game_SelfSwitches.prototype.filter = function(a, b) {
    return Object.keys(this._data).filter(function(key) {
        return Array.isArray(key) && (key[0] == a) && (key[1] == b);
    });
};

var $gameSelfvariables    = null;

//=============================================================================
// Game_SelfVariables
//=============================================================================

function Game_SelfVariables() {
    this.initialize.apply(this, arguments);
}

Game_SelfVariables.prototype.initialize = function() {
    this.clear();
};

Game_SelfVariables.prototype.clear = function() {
    this._data = {};
};

Game_SelfVariables.prototype.value = function(key) {
    return this._data[key] || 0;
};

Game_SelfVariables.prototype.strictValue = function(key) {
    var value = Number(this._data[key]);
    return (isNaN(value))? 0 : Number(value);
};

Game_SelfVariables.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = (isNaN(Number(value))||Array.isArray(value))? value : Number(value);
    } else {
        delete this._data[key];
    }
    this.onChange();
};

Game_SelfVariables.prototype.increaseValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)) return;
    this._data[key] = Number(this._data[key] || 0) + Number(value);
    this.onChange();
};

Game_SelfVariables.prototype.multiplyValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)) return;
    this._data[key] = Number(this._data[key] || 0) * Number(value);
    this.onChange();
};

Game_SelfVariables.prototype.divideValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)||value == 0) return;
    this._data[key] = Number(this._data[key] || 0) / Number(value);
    this.onChange();
};

Game_SelfVariables.prototype.modValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)||value == 0) return;
    this._data[key] = Number(this._data[key] || 0) % Number(value);
    this.onChange();
};

Game_SelfVariables.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

Game_SelfVariables.prototype.filter = function(a, b) {
    return Object.keys(this._data).filter(function(key) {
        return Array.isArray(key) && (key[0] == a) && (key[1] == b);
    });
};

//=============================================================================
// Game_BattleSwitches
//=============================================================================

function Game_BattleSwitches() {
    this.initialize.apply(this, arguments);
}

Game_BattleSwitches.prototype.initialize = function() {
    this.clear();
};

Game_BattleSwitches.prototype.clear = function() {
    this._data = {};
};

Game_BattleSwitches.prototype.value = function(key) {
    return !!this._data[key];
};

Game_BattleSwitches.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = true;
    } else {
        delete this._data[key];
    }
    this.onChange();
};

Game_BattleSwitches.prototype.onChange = function() {
    //$gameMap.requestRefresh();
};

var $gameBattleSwitches = new Game_BattleSwitches();

//=============================================================================
// Game_BattleVariables
//=============================================================================

function Game_BattleVariables() {
    this.initialize.apply(this, arguments);
}

Game_BattleVariables.prototype.initialize = function() {
    this.clear();
};

Game_BattleVariables.prototype.clear = function() {
    this._data = {};
};

Game_BattleVariables.prototype.value = function(key) {
    return this._data[key] || 0;
};

Game_BattleVariables.prototype.strictValue = function(key) {
    var value = Number(this._data[key]);
    return (isNaN(value))? 0 : Number(value);
};

Game_BattleVariables.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = (isNaN(Number(value))||Array.isArray(value))? value : Number(value);
    } else {
        delete this._data[key];
    }
    this.onChange();
};

Game_BattleVariables.prototype.increaseValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)) return;
    this._data[key] = Number(this._data[key] || 0) + Number(value);
    this.onChange();
};

Game_BattleVariables.prototype.multiplyValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)) return;
    this._data[key] = Number(this._data[key] || 0) * Number(value);
    this.onChange();
};

Game_BattleVariables.prototype.divideValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)||value == 0) return;
    this._data[key] = Number(this._data[key] || 0) / Number(value);
    this.onChange();
};

Game_BattleVariables.prototype.modValue = function(key, value) {
    var val = Number(this._data[key] || 0);
    if (isNaN(val)||isNaN(value)||value == 0) return;
    this._data[key] = Number(this._data[key] || 0) % Number(value);
    this.onChange();
};

Game_BattleVariables.prototype.onChange = function() {
    //$gameMap.requestRefresh();
};

var $gameBattleVariables = new Game_BattleVariables();

//=============================================================================
// Game_BattleTags
//=============================================================================

function Game_BattleTags() {
    this.initialize.apply(this, arguments);
}

Game_BattleTags.prototype.initialize = function() {
    this.clear();
};

Game_BattleTags.prototype.clear = function() {
    this._ATags = {};
    this._ETags = {};
};

Game_BattleTags.prototype.actorTags = function(key) {
    if (!this._ATags[key]) this._ATags[key] = [];
    return this._ATags[key];
};

Game_BattleTags.prototype.enemyTags = function(key) {
    if (!this._ETags[key]) this._ETags[key] = [];
    return this._ETags[key];
};

Game_BattleTags.prototype.clearActorTags = function(key) {
    this._ATags[key] = [];
};

Game_BattleTags.prototype.clearEnemyTags = function(key) {
    this._ETags[key] = [];
};

var $gameBattleTags = new Game_BattleTags();

//=============================================================================
// DataManager
//=============================================================================

ICF.MainUtility.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!ICF.MainUtility.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!ICF.MainUtility.Procesed) {
	ICF.NotetagsProcessor.MainUtility1();
	ICF.NotetagsProcessor.MainUtility2();
	ICF.MainUtility.Procesed = true;
    }
    return true;
};

ICF.NotetagsProcessor.MainUtility1 = function() {
    for (var n = 0; n < ICF.Param.subTraits.length; n++) {
	var obj = ICF.Param.subTraits[n];
	ICF.Param.subTraits[n] = [];
	var notedata = obj.split(/[\r\n]+/);
	for (var i = 0; i < notedata.length; i++) {
	    var line = notedata[i].split(/\s+/).clean();
	    if (isNaN(Number(line[0]))) {line = ICF.MainUtility.gettfield(line);};
	    if (line[0] > -1) {ICF.Param.subTraits[n].push({code:Number(line[0]), dataId:Number(line[1]), value:Number(line[2])});};
	}
    }
};

ICF.NotetagsProcessor.MainUtility2 = function() {
    for (var n = 0; n < ICF.Param.subEffects.length; n++) {
	var obj = ICF.Param.subEffects[n];
	ICF.Param.subEffects[n] = [];
	var notedata = obj.split(/[\r\n]+/);
	for (var i = 0; i < notedata.length; i++) {
	    var line = notedata[i].split(/\s+/).clean();
	    if (isNaN(Number(line[0]))) {line = ICF.MainUtility.getefield(line);};
	    if (line[0] > -1) {ICF.Param.subEffects[n].push({code:Number(line[0]), dataId:Number(line[1]), value1:Number(line[2]), value2:Number(line[3])});};
	}
    }
};

ICF.MainUtility.extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function(data) {
    ICF.MainUtility.extractMetadata.call(this, data);
    var note1 = /<(?:JSON[-_ ]MASTER)>/i;
    var note1b = /<\/(?:JSON[-_ ]MASTER)>/i;
    var note2 = /<(?:TRAITS[-_ ]MASTER)>/i;
    var note2b = /<\/(?:TRAITS[-_ ]MASTER)>/i;
    var note3 = /<(?:SUBTRAITS[-_ ]MASTER)>/i;
    var note3b = /<\/(?:SUBTRAITS[-_ ]MASTER)>/i;
    var note4 = /<(?:EFFECTS[-_ ]MASTER)>/i;
    var note4b = /<\/(?:EFFECTS[-_ ]MASTER)>/i;
    var note5 = /<(?:SUBEFFECTS[-_ ]MASTER)>/i;
    var note5b = /<\/(?:SUBEFFECTS[-_ ]MASTER)>/i;
    var note6 = /<(?:JSEVAL[-_ ]MASTER)[ ]+(\w+(?:\s+\w+)*)[ ]*>/i;
    var note6b = /<\/(?:JSEVAL[-_ ]MASTER)>/i;
    var note7 = /<(?:TAGS)[ ]+((?:[\w-_]+\s*)+)>/i;
    var note7b = /<(?:TAG)[ ]+((?:[\w-_]+\s*)+)>/i;

    var notedata = data.note.split(/[\r\n]+/);

    var flag1 = false;
    var flag2 = false;
    var flag3 = false;
    var flag4 = false;
    var flag5 = false;
    var flag6 = false;

    var subindex = -1;
    var subeindex = -1;

    data.jsreactions = data.jsreactions || {};
    data.tags = data.tags || [];
    var key = '';

    for (var i = 0; i < notedata.length; i++) {
	var line = notedata[i].trim().replace(/\s+/g, ' ');
	if (line.match(note1)) {
		flag1 = true;
	} else if (line.match(note1b)) {
		flag1 = false;
	} else if (line.match(note2)) {
		flag2 = true;
		data.traits = data.traits || [];
	} else if (line.match(note2b)) {
		flag2 = false;
	} else if (line.match(note3)) {
		flag3 = true;
		subindex += 1;
		data.subtraits = data.subtraits || [];
		data.subtraits[subindex] = data.subtraits[subindex] || {};
		data.subtraits[subindex].traits = data.subtraits[subindex].traits || [];
	} else if (line.match(note3b)) {
		flag3 = false;
	} else if (line.match(note4)) {
		flag4 = true;
		data.effects = data.effects || [];
	} else if (line.match(note4b)) {
		flag4 = false;
	} else if (line.match(note5)) {
		flag5 = true;
		subeindex += 1;
		data.subeffects = data.subeffects || [];
		data.subeffects[subeindex] = data.subeffects[subeindex] || {};
		data.subeffects[subeindex].effects = data.subeffects[subeindex].effects || [];
	} else if (line.match(note5b)) {
		flag5 = false;
	} else if (line.match(note6)) {
		flag6 = true;
		key = RegExp.$1.split(/\s+/);
		data.jsreactions[key] = data.jsreactions[key] || '';
	} else if (line.match(note6b)) {
		flag6 = false;
		key = '';
	} else if (line.match(note7)) {
		data.tags = data.tags.concat(RegExp.$1.trim().split(/\s+/));
	} else if (line.match(note7b)) {
		data.tags = data.tags.push(RegExp.$1.trim());
	} else if (flag1) {
		var field = line.split(":")[0];
		line = line.substring(line.indexOf(':') + 1);
		data[field] = JsonEx.parse(line);
	} else if (flag2) {
		line = line.split(/\s+/).clean();
		if (isNaN(Number(line[0]))) {line = ICF.MainUtility.gettfield(line);};
		if (line[0] > -1) {data.traits.push({code:Number(line[0]), dataId:Number(line[1]), value:Number(line[2])});};
	} else if (flag3) {
		line = line.split(/\s+/).clean();
		if (isNaN(Number(line[0]))) {line = ICF.MainUtility.gettfield(line);};
		if (line[0] > -1) {data.subtraits[subindex].traits.push({code:Number(line[0]), dataId:Number(line[1]), value:Number(line[2])});};
	} else if (flag4) {
		line = line.split(/\s+/).clean();
		if (isNaN(Number(line[0]))) {line = ICF.MainUtility.getefield(line);};
		if (line[0] > -1) {data.effects.push({code:Number(line[0]), dataId:Number(line[1]), value1:Number(line[2]), value2:Number(line[3])});};
	} else if (flag5) {
		line = line.split(/\s+/).clean();
		if (isNaN(Number(line[0]))) {line = ICF.MainUtility.getefield(line);};
		if (line[0] > -1) {data.subeffects[subeindex].effects.push({code:Number(line[0]), dataId:Number(line[1]), value1:Number(line[2]), value2:Number(line[3])});};
	} else if (flag6) {
		data.jsreactions[key] = data.jsreactions[key] + line + '\n';
	}

    }
};

if (!Imported.ICFSoft_MainCore) {
    ICF.MainUtility.createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
	ICF.MainUtility.createGameObjects.call(this);
	$gameSelfVariables = new Game_SelfVariables();
    };

    ICF.MainUtility.extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
	ICF.MainUtility.extractSaveContents.call(this, contents);
	$gameSelfVariables = contents.selfVariables;
	if (!$gameSelfVariables) $gameSelfVariables = new Game_SelfVariables();
    };

    ICF.MainUtility.makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
	var contents = ICF.MainUtility.makeSaveContents.call(this);
	contents.selfvariables = $gameSelfvariables;
	return contents;
    };

    DataManager.loadDataArrayFiles = function(name, index, src) {
	window[name] = window[name] || [];
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
	    if (xhr.status < 400) {
	        window[name][index] = JSON.parse(xhr.responseText);
	        DataManager.onLoad(window[name][index]);
	    }
	};
	xhr.onerror = function() {
	    DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name][index] = null;
	xhr.send();
    };

    DataManager.loadDataObjFiles = function(name, key, src) {
	window[name] = window[name] || {};
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
	    if (xhr.status < 400) {
	        window[name][key] = JSON.parse(xhr.responseText);
	        DataManager.onLoad(window[name][key]);
	    }
	};
	xhr.onerror = function() {
	    DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name][key] = null;
	xhr.send();
    };

} else {
    ICF.MainUtility.createGameObjects = DataManager.createGameObjectsPhase1;
    DataManager.createGameObjectsPhase1 = function() {
	ICF.MainUtility.createGameObjects.call(this);
	$gameSelfVariables = new Game_SelfVariables();
    };

    ICF.MainUtility.extractSaveContents = DataManager.extractSaveContentsPhase1;
    DataManager.extractSaveContentsPhase1 = function(contents) {
	ICF.MainUtility.extractSaveContents.call(this, contents);
	$gameSelfVariables = contents.selfVariables;
	if (!$gameSelfVariables) $gameSelfVariables = new Game_SelfVariables();
    };

    ICF.MainUtility.makeSaveContents = DataManager.makeSaveContentsPhase1;
    DataManager.makeSaveContentsPhase1 = function() {
	var contents = ICF.MainUtility.makeSaveContents.call(this);
	contents.selfvariables = $gameSelfvariables;
	return contents;
    };

}


//=============================================================================
// Game_BattlerBase
//=============================================================================

Object.defineProperty(Game_BattlerBase.prototype, 'level', { value: 1, configurable: true});

if (!Game_BattlerBase.prototype.equips) Game_BattlerBase.prototype.equips = function() { return []; };
if (!Game_BattlerBase.prototype.weapons) Game_BattlerBase.prototype.weapons = function() { return []; };
if (!Game_BattlerBase.prototype.armors) Game_BattlerBase.prototype.armors = function() { return []; };
if (!Game_BattlerBase.prototype.currentClass) Game_BattlerBase.prototype.currentClass = function() { return null; };

Game_BattlerBase.prototype.hasWeapon = function(weapon) {
    return this.weapons().contains(weapon);
};

Game_BattlerBase.prototype.hasArmor = function(armor) {
    return this.armors().contains(armor);
};


ICF.MainUtility.traitObjects = Game_BattlerBase.prototype.traitObjects;
Game_BattlerBase.prototype.traitObjects = function() {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    return ICF.MainUtility.traitObjects.call(this).concat([this._traitsObject]);
};

ICF.MainUtility.initMembers = Game_BattlerBase.prototype.initMembers;
Game_BattlerBase.prototype.initMembers = function() {
    ICF.MainUtility.initMembers.call(this);
    this._traitsObject = {};
    this._traitsObject.traits = [];
    this._tags = [];
};

Game_BattlerBase.prototype.clearTraits = function() {
    if (!this._traitsObject) {
	this._traitsObject = {};
    }
    this._traitsObject.traits = [];
};

Game_BattlerBase.prototype.addTrait = function(code, dataid, value) {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    ICF.MainUtility.addTrait(this._traitsObject, 0, code, dataid, value);
};

Game_BattlerBase.prototype.setTrait = function(code, dataid, value) {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    ICF.MainUtility.addTrait(this._traitsObject, 1, code, dataid, value);
};

Game_BattlerBase.prototype.increaseTrait = function(code, dataid, value) {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    ICF.MainUtility.addTrait(this._traitsObject, 2, code, dataid, value);
};

Game_BattlerBase.prototype.multiplyTrait = function(code, dataid, value) {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    ICF.MainUtility.addTrait(this._traitsObject, 3, code, dataid, value);
};

Game_BattlerBase.prototype.removeTrait = function(code, dataid) {
    if (!this._traitsObject) {
	this._traitsObject = {};
	this._traitsObject.traits = [];
    }
    ICF.MainUtility.removeTrait(this._traitsObject, code, dataid);
};

Game_BattlerBase.prototype.selfswitch = function(selfswitch) { return false;};

Game_BattlerBase.prototype.selfswitches = function() { return [];};

Game_BattlerBase.prototype.selfswitchNames = function() { return [];};

Game_BattlerBase.prototype.setselfswitch = function(selfswitch, value) { };

Game_BattlerBase.prototype.battleswitch = function(selfswitch) { return false;};

Game_BattlerBase.prototype.setbattleswitch = function(selfswitch, value) { };

Game_BattlerBase.prototype.selfvariable = function(selfvariable) { return 0;};

Game_BattlerBase.prototype.strictselfvariable = function(selfvariable) { return 0;};

Game_BattlerBase.prototype.selfvariables = function() { return [];};

Game_BattlerBase.prototype.selfvariableNames = function() { return [];};

Game_BattlerBase.prototype.setselfvariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.increaseselfvariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.multiplyselfvariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.divideselfvariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.modselfvariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.battlevariable = function(selfvariable) { return 0;};

Game_BattlerBase.prototype.strictbattlevariable = function(selfvariable) { return 0;};

Game_BattlerBase.prototype.setbattlevariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.increasebattlevariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.multiplybattlevariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.dividebattlevariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.modbattlevariable = function(selfvariable, value) { };

Game_BattlerBase.prototype.addTag = function(tag) {
    if (!this._tags) this._tags = [];
    this._tags.push(tag);
};

Game_BattlerBase.prototype.addTags = function(tags) {
    if (!this._tags) this._tags = [];
    this._tags = this._tags.concat(tags);
};

Game_BattlerBase.prototype.removeTag = function(tag) {
    if (!this._tags) this._tags = [];
    var i = this._tags.indexOf(tag);
    while (i > -1) {
	this._tags.splice(i,1);
	i = this._tags.indexOf(tag);
    }
};

Game_BattlerBase.prototype.removeTags = function(tags) {
    if (!this._tags) this._tags = [];
    for (var i = 0; i < tags.length; i++) {
	var j = this._tags.indexOf(tags[i]);
	while (j > -1) {
	    this._tags.splice(j,1);
	    j = this._tags.indexOf(tags[i]);
	}
    }
};

Game_BattlerBase.prototype.clearTags = function() {
    this._tags = [];
};

Game_BattlerBase.prototype.addBattleTag = function(tag) {
    this.battleTags().push(tag);
};

Game_BattlerBase.prototype.addBattleTags = function(tags) {
    var tagss = this.battleTags();
    for (var i = 0; i < tags.length; i++) {
	tagss.push(tags[i]);
    }
};

Game_BattlerBase.prototype.removeBattleTag = function(tag) {
    var tags = this.battleTags();
    var i = tags.indexOf(tag);
    while (i > -1) {
	tags.splice(i,1);
	i = tags.indexOf(tag);
    }
};

Game_BattlerBase.prototype.removeBattleTags = function(tags) {
    var tagss = this.battleTags();
    for (var i = 0; i < tags.length; i++) {
	var j = tagss.indexOf(tags[i]);
	while (j > -1) {
	    tagss.splice(j,1);
	    j = tagss.indexOf(tags[i]);
	}
    }
};

Game_BattlerBase.prototype.clearBattleTags = function() {};

Game_BattlerBase.prototype.hasBaseTag = function(tag) {
    return this.baseTags().contains(tag);
};

Game_BattlerBase.prototype.hasStateTag = function(tag, fix) {
    return this.stateTags().contains(tag);
};

Game_BattlerBase.prototype.hasWeaponTag = function(tag) {
    return this.weaponTags().contains(tag);
};

Game_BattlerBase.prototype.hasArmorTag = function(tag) {
    return this.armorTags().contains(tag);
};

Game_BattlerBase.prototype.hasEquipTag = function(tag) {
    return this.equipTags().contains(tag);
};

Game_BattlerBase.prototype.hasTag = function(tag, fix) {
    return this.allTags(fix).contains(tag);
};

Game_BattlerBase.prototype.countBaseTags = function(tags) {
    var r = 0;
    var tagss = this.baseTags();
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.countStateTags = function(tags, fix) {
    var r = 0;
    var tagss = this.stateTags(fix);
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.countWeaponTags = function(tags) {
    var r = 0;
    var tagss = this.weaponTags();
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.countArmorTags = function(tags) {
    var r = 0;
    var tagss = this.armorTags();
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.countEquipTags = function(tags) {
    var r = 0;
    var tagss = this.equipTags();
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.countTags = function(tags, fix) {
    var r = 0;
    var tagss = this.allTags(fix);
    for (var i = 0; i < tags.length; i++) {
	if (tagss.contains(tags[i])) r++;
    }
    return r;
};

Game_BattlerBase.prototype.baseTags = function() {
    if (!this._tags) this._tags = [];
    return this._tags;
};

Game_BattlerBase.prototype.battleTags = function() {
    return [];
};

Game_BattlerBase.prototype.stateTags = function(fix) {
    if (fix) return this._states.reduce(function(r, obj) {
        return r.concat([obj.tags]);
    }, []);
    return this.states().reduce(function(r, obj) {
        return r.concat([obj.tags]);
    }, []);
};

Game_BattlerBase.prototype.weaponTags = function() {
    var tags = [];
    var equips = this.weapons();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            tags = tags.concat(item.tags);
        }
    }
    return tags;
};

Game_BattlerBase.prototype.armorTags = function() {
    var tags = [];
    var equips = this.armors();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            tags = tags.concat(item.tags);
        }
    }
    return tags;
};

Game_BattlerBase.prototype.equipTags = function() {
    var tags = [];
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            tags = tags.concat(item.tags);
        }
    }
    return tags;
};

Game_BattlerBase.prototype.allTags = function(fix) {
    if (!this._tags) this._tags = [];
    if (fix) return this._tags.concat(this._states.reduce(function(r, obj) {
        return r.concat([obj.tags]);
    }, [])).concat((this.friendsUnit().inBattle())? this.battleTags() : []);
    return this._tags.concat(this.states().reduce(function(r, obj) {
        return r.concat([obj.tags]);
    }, [])).concat((this.friendsUnit().inBattle())? this.battleTags() : []);
};

Game_BattlerBase.prototype.jsevalObjects = function() {
    return this.states().filter(function(obj) {
        return Object.keys(obj.jsreactions).length > 0;
    });
};

Game_BattlerBase.prototype.jsevalReactions = function(subject, item, isSkill, reaction) {
    var jsevalobjects = this.jsevalObjects();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;

    for (var h = 0; h < jsevalobjects.length; h++) {
	if (jsevalobjects[h].jsreactions[reaction]) eval(jsevalobjects[h].jsreactions[reaction]);
    }
};

Game_BattlerBase.prototype.jsevalArrayReactions = function(subject, item, isSkill, reactions) {
    var jsevalobjects = this.jsevalObjects();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;

    for (var h = 0; h < jsevalobjects.length; h++) {
	for (var i = 0; i < reactions.length; i++) {
		if (jsevalobjects[h].jsreactions[reactions[i]]) eval(jsevalobjects[h].jsreactions[reactions[i]]);
	}
    }
};

Game_BattlerBase.prototype.jsevalBulkReactions = function(subject, item, isSkill, reactions) {
    var jsevalobjects = this.jsevalObjects();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;

    for (var h = 0; h < jsevalobjects.length; h++) {
	for (var i = 0; i < reactions.length; i++) {
		for (var j = 0; j < reactions[i][1].length; j++) {
			var key = [reactions[i][0],reactions[i][1][j]];
			if (jsevalobjects[h].jsreactions[key]) eval(jsevalobjects[h].jsreactions[key]);
		}
	}
    }
};

//=============================================================================
// Game_Battler
//=============================================================================

if (!Imported.ICFSoft_MainCore) {
    Game_Battler.prototype.gainHp = function(value) {
	this._result.hpDamage -= value;
	this._result.hpAffected = true;
	this.setHp(this.hp + value);
    };

    Game_Battler.prototype.gainMp = function(value) {
	this._result.mpDamage -= value;
	this.setMp(this.mp + value);
    };

    Game_Battler.prototype.gainTp = function(value) {
	this._result.tpDamage -= value;
	this.setTp(this.tp + value);
    };
}

//=============================================================================
// Game_Actor
//=============================================================================

Game_Actor.prototype.selfswitch = function(selfswitch) {
	var key = [0, this._actorId, selfswitch];
	return $gameSelfSwitches.value(key);
}

Game_Actor.prototype.selfswitches = function() {
	return $gameSelfSwitches.filter(0, this._actorId);
}

Game_Actor.prototype.selfswitchNames = function() {
	return $gameSelfSwitches.filter(0, this._actorId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Actor.prototype.setselfswitch = function(selfswitch, value) {
	ICF.MainUtility.CustomSwitch(0, this._actorId, selfswitch, value);
}

Game_Actor.prototype.battleswitch = function(selfswitch) {
	var key = [0, this._actorId, selfswitch];
	return $gameBattleSwitches.value(key);
}

Game_Actor.prototype.setbattleswitch = function(selfswitch, value) {
	ICF.MainUtility.BattleSwitch(0, this._actorId, selfswitch, value);
}

Game_Actor.prototype.selfvariable = function(selfvariable) {
	var key = [0, this._actorId, selfvariable];
	return $gameSelfVariables.value(key);
}

Game_Actor.prototype.strictselfvariable = function(selfvariable) {
	var key = [0, this._actorId, selfvariable];
	return $gameSelfVariables.strictValue(key);
}

Game_Actor.prototype.selfvariables = function() {
	return $gameSelfVariables.filter(0, this._actorId);
}

Game_Actor.prototype.selfvariableNames = function() {
	return $gameSelfVariables.filter(0, this._actorId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Actor.prototype.setselfvariable = function(selfvariable, value) {
	ICF.MainUtility.CustomVariable(0, this._actorId, selfvariable, value);
}

Game_Actor.prototype.increaseselfvariable = function(selfvariable, value) {
	ICF.MainUtility.IncreaseCustomVariable(0, this._actorId, selfvariable, value);
}

Game_Actor.prototype.multiplyselfvariable = function(selfvariable, value) {
	ICF.MainUtility.MultiplyCustomVariable(0, this._actorId, selfvariable, value);
}

Game_Actor.prototype.divideselfvariable = function(selfvariable, value) {
	ICF.MainUtility.DivideCustomVariable(0, this._actorId, selfvariable, value);
}

Game_Actor.prototype.modselfvariable = function(selfvariable, value) {
	ICF.MainUtility.ModCustomVariable(0, this._actorId, selfvariable, value);
}

Game_Actor.prototype.battlevariable = function(battlevariable) {
	var key = [0, this._actorId, battlevariable];
	return $gameBattleVariables.value(key);
}

Game_Actor.prototype.strictbattlevariable = function(battlevariable) {
	var key = [0, this._actorId, battlevariable];
	return $gameBattleVariables.strictValue(key);
}

Game_Actor.prototype.setbattlevariable = function(battlevariable, value) {
	ICF.MainUtility.BattleVariable(0, this._actorId, battlevariable, value);
}

Game_Actor.prototype.increasebattlevariable = function(battlevariable, value) {
	ICF.MainUtility.IncreaseBattleVariable(0, this._actorId, battlevariable, value);
}

Game_Actor.prototype.multiplybattlevariable = function(battlevariable, value) {
	ICF.MainUtility.MultiplyBattleVariable(0, this._actorId, battlevariable, value);
}

Game_Actor.prototype.dividebattlevariable = function(battlevariable, value) {
	ICF.MainUtility.DivideBattleVariable(0, this._actorId, battlevariable, value);
}

Game_Actor.prototype.modbattlevariable = function(battlevariable, value) {
	ICF.MainUtility.ModBattleVariable(0, this._actorId, battlevariable, value);
}

Game_Actor.prototype.baseTags = function() {
    return Game_BattlerBase.prototype.baseTags.call(this).concat(this.actor().tags).concat(this.currentClass().tags);
};

Game_Actor.prototype.allTags = function(fix) {
    var tags = Game_BattlerBase.prototype.allTags.call(this, fix).concat(this.actor().tags).concat(this.currentClass().tags);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            tags = tags.concat(item.tags);
        }
    }
    return tags;
};

Game_Actor.prototype.battleTags = function() {
    return $gameBattleTags.actorTags(this._actorId);
};

Game_Actor.prototype.clearBattleTags = function() {
    $gameBattleTags.clearActorTags(this._actorId);
};

Game_Actor.prototype.jsevalObjects = function() {
    var objects = [this.actor(), this.currentClass()];
    objects = objects.concat(Game_Battler.prototype.jsevalObjects.call(this));
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects.filter(function(obj) {
        return Object.keys(obj.jsreactions).length > 0;
    });
};

//=============================================================================
// Game_Enemy
//=============================================================================

Game_Enemy.prototype.selfswitch = function(selfswitch) {
	var key = ["e", this._enemyId, selfswitch];
	return $gameSelfSwitches.value(key);
}

Game_Enemy.prototype.selfswitches = function() {
	return $gameSelfSwitches.filter("e", this._enemyId);
}

Game_Enemy.prototype.selfswitchNames = function() {
	return $gameSelfSwitches.filter("e", this._enemyId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Enemy.prototype.setselfswitch = function(selfswitch, value) {
	ICF.MainUtility.CustomSwitch("e", this._enemyId, selfswitch, value);
}

Game_Enemy.prototype.battleswitch = function(battleswitch) {
	var key = ["e", this.index(), battleswitch];
	return $gameBattleSwitches.value(key);
}

Game_Enemy.prototype.setbattleswitch = function(battleswitch, value) {
	var key = ["e", this.index(), battleswitch];
	value = (value.toString().toLowerCase() === "true");
	$gameBattleSwitches.setValue(key, value);
}

Game_Enemy.prototype.selfvariable = function(selfvariable) {
	var key = ["e", this._enemyId, selfvariable];
	return $gameSelfVariables.value(key);
}

Game_Enemy.prototype.strictselfvariable = function(selfvariable) {
	var key = ["e", this._enemyId, selfvariable];
	return $gameSelfVariables.strictValue(key);
}

Game_Enemy.prototype.selfvariables = function() {
	return $gameSelfVariables.filter("e", this._enemyId);
}

Game_Enemy.prototype.selfvariableNames = function() {
	return $gameSelfVariables.filter("e", this._enemyId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Enemy.prototype.setselfvariable = function(selfvariable, value) {
	var _key = ["e", this._enemyId, selfvariable];
	$gameSelfVariables.setValue(_key, value);
}

Game_Enemy.prototype.increaseselfvariable = function(selfvariable, value) {
	var _key = ["e", this._enemyId, selfvariable];
	$gameSelfVariables.increaseValue(_key, value);
}

Game_Enemy.prototype.multiplyselfvariable = function(selfvariable, value) {
	var _key = ["e", this._enemyId, selfvariable];
	$gameSelfVariables.multiplyValue(_key, value);
}

Game_Enemy.prototype.divideselfvariable = function(selfvariable, value) {
	var _key = ["e", this._enemyId, selfvariable];
	$gameSelfVariables.divideValue(_key, value);
}

Game_Enemy.prototype.modselfvariable = function(selfvariable, value) {
	var _key = ["e", this._enemyId, selfvariable];
	$gameSelfVariables.modValue(_key, value);
}

Game_Enemy.prototype.battlevariable = function(battlevariable) {
	var key = ["e", this.index(), battlevariable];
	return $gameBattleVariables.value(key);
}

Game_Enemy.prototype.strictbattlevariable = function(battlevariable) {
	var key = ["e", this.index(), battlevariable];
	return $gameBattleVariables.strictValue(key);
}

Game_Enemy.prototype.setbattlevariable = function(battlevariable, value) {
	var _key = ["e", this.index(), battlevariable];
	$gameBattleVariables.setValue(_key, value);
}

Game_Enemy.prototype.increasebattlevariable = function(battlevariable, value) {
	var _key = ["e", this.index(), battlevariable];
	$gameBattleVariables.increaseValue(_key, value);
}

Game_Enemy.prototype.multiplybattlevariable = function(battlevariable, value) {
	var _key = ["e", this.index(), battlevariable];
	$gameBattleVariables.multiplyValue(_key, value);
}

Game_Enemy.prototype.dividebattlevariable = function(battlevariable, value) {
	var _key = ["e", this.index(), battlevariable];
	$gameBattleVariables.divideValue(_key, value);
}

Game_Enemy.prototype.modbattlevariable = function(battlevariable, value) {
	var _key = ["e", this.index(), battlevariable];
	$gameBattleVariables.modValue(_key, value);
}

Game_Enemy.prototype.baseTags = function() {
    return Game_BattlerBase.prototype.baseTags.call(this).concat(this.enemy().tags);
};

Game_Enemy.prototype.allTags = function(fix) {
    return Game_BattlerBase.prototype.allTags.call(this, fix).concat(this.enemy().tags);
};

Game_Enemy.prototype.battleTags = function() {
    return $gameBattleTags.enemyTags(this.index());
};

Game_Enemy.prototype.clearBattleTags = function() {
    $gameBattleTags.clearEnemyTags(this.index());
};

Game_Enemy.prototype.jsevalObjects = function() {
    var objects = [this.enemy()];
    objects = objects.concat(Game_Battler.prototype.jsevalObjects.call(this));
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects.filter(function(obj) {
        return Object.keys(obj.jsreactions).length > 0;
    });
};

//=============================================================================
// Game_Unit
//=============================================================================

Game_Unit.prototype.selfswitch = function(selfswitch) { return false;};

Game_Unit.prototype.selfvariable = function(selfvariable) { return 0;};

Game_Unit.prototype.maxselfvariable = function(selfvariable) { return 0;};

Game_Unit.prototype.minselfvariable = function(selfvariable) { return 0;};

Game_Unit.prototype.avgselfvariable = function(selfvariable) { return 0;};

Game_Unit.prototype.battleswitch = function(battleswitch) { return false;};

Game_Unit.prototype.battlevariable = function(battlevariable) { return 0;};

Game_Unit.prototype.maxbattlevariable = function(battlevariable) { return 0;};

Game_Unit.prototype.minbattlevariable = function(battlevariable) { return 0;};

Game_Unit.prototype.avgbattlevariable = function(battlevariable) { return 0;};

//=============================================================================
// Game_Troop
//=============================================================================

ICF.MainUtility.clearTroop = Game_Troop.prototype.clear;
Game_Troop.prototype.clear = function() {
    ICF.MainUtility.clearTroop.call(this);
    $gameBattleSwitches.clear();
    $gameBattleVariables.clear();
    $gameBattleTags.clear();
};

Game_Troop.prototype.selfswitch = function(selfswitch) {
    this.aliveMembers().forEach(function(enemy) {
        if (enemy.selfswitch(selfswitch)) {
            return true;
        }
    });
    return false;
}

Game_Troop.prototype.selfvariable = function(selfvariable) {
    var value = 0;
    this.aliveMembers().forEach(function(enemy) {
        value += enemy.strictselfvariable(selfvariable);
    });
    return Math.floor(value);
}

Game_Troop.prototype.maxselfvariable = function(selfvariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictselfvariable(selfvariable);
    this.aliveMembers().forEach(function(enemy) {
        value = Math.max(value, enemy.strictselfvariable(selfvariable));
    });
    return Math.floor(value);
}

Game_Troop.prototype.minselfvariable = function(selfvariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictselfvariable(selfvariable);
    this.aliveMembers().forEach(function(enemy) {
        value = Math.min(value, enemy.strictselfvariable(selfvariable));
    });
    return Math.floor(value);
}

Game_Troop.prototype.avgselfvariable = function(selfvariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = 0;
    this.aliveMembers().forEach(function(enemy) {
        value += enemy.strictselfvariable(selfvariable);
    });
    return Math.floor(value / this.aliveMembers().length);
}

Game_Troop.prototype.battleswitch = function(battleswitch) {
    this.aliveMembers().forEach(function(enemy) {
        if (enemy.battleswitch(battleswitch)) {
            return true;
        }
    });
    return false;
}

Game_Troop.prototype.battlevariable = function(battlevariable) {
    var value = 0;
    this.aliveMembers().forEach(function(enemy) {
        value += enemy.strictbattlevariable(battlevariable);
    });
    return Math.floor(value);
}

Game_Troop.prototype.maxbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictbattlevariable(battlevariable);
    this.aliveMembers().forEach(function(enemy) {
        value = Math.max(value, enemy.strictbattlevariable(battlevariable));
    });
    return Math.floor(value);
}

Game_Troop.prototype.minbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictbattlevariable(battlevariable);
    this.aliveMembers().forEach(function(enemy) {
        value = Math.min(value, enemy.strictbattlevariable(battlevariable));
    });
    return Math.floor(value);
}

Game_Troop.prototype.avgbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = 0;
    this.aliveMembers().forEach(function(enemy) {
        value += enemy.strictbattlevariable(battlevariable);
    });
    return Math.floor(value / this.aliveMembers().length);
}

//=============================================================================
// Game_Party
//=============================================================================

Game_Party.prototype.selfswitch = function(selfswitch) {
    this.allMembers().forEach(function(actor) {
        if (actor.selfswitch(selfswitch)) {
            return true;
        }
    });
    return false;
}

Game_Party.prototype.selfvariable = function(selfvariable) {
    var value = 0;
    this.allMembers().forEach(function(actor) {
        value += actor.strictselfvariable(selfvariable);
    });
    return Math.floor(value);
}

Game_Party.prototype.maxselfvariable = function(selfvariable) {
    if (this.allMembers().length < 1) return 0;
    var value = this.allMembers()[0].strictselfvariable(selfvariable);
    this.allMembers().forEach(function(actor) {
        value = Math.max(value, actor.strictselfvariable(selfvariable));
    });
    return Math.floor(value);
}

Game_Party.prototype.minselfvariable = function(selfvariable) {
    if (this.allMembers().length < 1) return 0;
    var value = this.allMembers()[0].strictselfvariable(selfvariable);
    this.allMembers().forEach(function(actor) {
        value = Math.min(value, actor.strictselfvariable(selfvariable));
    });
    return Math.floor(value);
}

Game_Party.prototype.avgselfvariable = function(selfvariable) {
    if (this.allMembers().length < 1) return 0;
    var value = 0;
    this.allMembers().forEach(function(actor) {
        value += actor.strictselfvariable(selfvariable);
    });
    return Math.floor(value / this.allMembers().length);
}

Game_Party.prototype.battleswitch = function(battleswitch) {
    this.aliveMembers().forEach(function(actor) {
        if (actor.battleswitch(battleswitch)) {
            return true;
        }
    });
    return false;
}

Game_Party.prototype.battlevariable = function(battlevariable) {
    var value = 0;
    this.aliveMembers().forEach(function(actor) {
        value += actor.strictbattlevariable(battlevariable);
    });
    return Math.floor(value);
}

Game_Party.prototype.maxbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictbattlevariable(battlevariable);
    this.aliveMembers().forEach(function(actor) {
        value = Math.max(value, actor.strictbattlevariable(battlevariable));
    });
    return Math.floor(value);
}

Game_Party.prototype.minbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = this.aliveMembers()[0].strictbattlevariable(battlevariable);
    this.aliveMembers().forEach(function(actor) {
        value = Math.min(value, actor.strictbattlevariable(battlevariable));
    });
    return Math.floor(value);
}

Game_Party.prototype.avgbattlevariable = function(battlevariable) {
    if (this.aliveMembers().length < 1) return 0;
    var value = 0;
    this.aliveMembers().forEach(function(actor) {
        value += actor.strictbattlevariable(battlevariable);
    });
    return Math.floor(value / this.aliveMembers().length);
}

//=============================================================================
// Game_Event
//=============================================================================

Game_Event.prototype.selfswitch = function(selfswitch) {
	var key = [this._mapId, this._eventId, selfswitch];
	return $gameSelfSwitches.value(key);
}

Game_Event.prototype.selfswitches = function() {
	return $gameSelfSwitches.filter(this._mapId, this._eventId);
}

Game_Event.prototype.selfswitchNames = function() {
	return $gameSelfSwitches.filter(this._mapId, this._eventId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Event.prototype.setselfswitch = function(selfswitch, value) {
	ICF.MainUtility.CustomSwitch(this._mapId, this._eventId, selfswitch, value);
}

Game_Event.prototype.mapswitch = function(mapswitch) {
	var key = [this._mapId, 0, mapswitch];
	return $gameSelfSwitches.value(key);
}

Game_Event.prototype.mapswitches = function() {
	return $gameSelfSwitches.filter(this._mapId, 0);
}

Game_Event.prototype.mapswitchNames = function() {
	return $gameSelfSwitches.filter(this._mapId, 0).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Event.prototype.setmapswitch = function(mapswitch, value) {
	ICF.MainUtility.CustomSwitch(this._mapId, 0, mapswitch, value);
}

Game_Event.prototype.selfvariable = function(selfvariable) {
	var key = [this._mapId, this._eventId, selfvariable];
	return $gameSelfVariables.value(key);
}

Game_Event.prototype.strictselfvariable = function(selfvariable) {
	var key = [this._mapId, this._eventId, selfvariable];
	return $gameSelfVariables.strictValue(key);
}

Game_Event.prototype.selfvariables = function() {
	return $gameSelfVariables.filter(this._mapId, this._eventId);
}

Game_Event.prototype.selfvariableNames = function() {
	return $gameSelfVariables.filter(this._mapId, this._eventId).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Event.prototype.setselfvariable = function(selfvariable, value) {
	ICF.MainUtility.CustomVariable(this._mapId, this._eventId, selfvariable, value);
}

Game_Event.prototype.increaseselfvariable = function(selfvariable, value) {
	ICF.MainUtility.IncreaseCustomVariable(this._mapId, this._eventId, selfvariable, value);
}

Game_Event.prototype.multiplyselfvariable = function(selfvariable, value) {
	ICF.MainUtility.MultiplyCustomVariable(this._mapId, this._eventId, selfvariable, value);
}

Game_Event.prototype.divideselfvariable = function(selfvariable, value) {
	ICF.MainUtility.DivideCustomVariable(this._mapId, this._eventId, selfvariable, value);
}

Game_Event.prototype.modselfvariable = function(selfvariable, value) {
	ICF.MainUtility.ModCustomVariable(this._mapId, this._eventId, selfvariable, value);
}

Game_Event.prototype.mapvariable = function(mapvariable) {
	var key = [this._mapId, 0, mapvariable];
	return $gameSelfVariables.value(key);
}

Game_Event.prototype.strictmapvariable = function(mapvariable) {
	var key = [this._mapId, 0, mapvariable];
	return $gameSelfVariables.strictValue(key);
}

Game_Event.prototype.mapvariables = function() {
	return $gameSelfVariables.filter(this._mapId, 0);
}

Game_Event.prototype.mapvariableNames = function() {
	return $gameSelfVariables.filter(this._mapId, 0).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Event.prototype.setmapvariable = function(mapvariable, value) {
	ICF.MainUtility.CustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Event.prototype.increasemapvariable = function(mapvariable, value) {
	ICF.MainUtility.IncreaseCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Event.prototype.multiplymapvariable = function(mapvariable, value) {
	ICF.MainUtility.MultiplyCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Event.prototype.dividemapvariable = function(mapvariable, value) {
	ICF.MainUtility.DivideCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Event.prototype.modmapvariable = function(mapvariable, value) {
	ICF.MainUtility.ModCustomVariable(this._mapId, 0, mapvariable, value);
}

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.mapswitch = function(mapswitch) {
	var key = [this._mapId, 0, mapswitch];
	return $gameSelfSwitches.value(key);
}

Game_Map.prototype.mapswitches = function() {
	return $gameSelfSwitches.filter(this._mapId, 0);
}

Game_Map.prototype.mapswitchNames = function() {
	return $gameSelfSwitches.filter(this._mapId, 0).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Map.prototype.setmapswitch = function(mapswitch, value) {
	ICF.MainUtility.CustomSwitch(this._mapId, 0, mapswitch, value);
}

Game_Map.prototype.mapvariable = function(mapvariable) {
	var key = [this._mapId, 0, mapvariable];
	return $gameSelfVariables.value(key);
}

Game_Map.prototype.mapvariables = function() {
	return $gameSelfVariables.filter(this._mapId, 0);
}

Game_Map.prototype.mapvariableNames = function() {
	return $gameSelfVariables.filter(this._mapId, 0).reduce(function(r, obj) {
		return r.concat([obj[2]]);
	}, []);
}

Game_Map.prototype.strictmapvariable = function(mapvariable) {
	var key = [this._mapId, 0, mapvariable];
	return $gameSelfVariables.strictValue(key);
}

Game_Map.prototype.setmapvariable = function(mapvariable, value) {
	ICF.MainUtility.CustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Map.prototype.increasemapvariable = function(mapvariable, value) {
	ICF.MainUtility.IncreaseCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Map.prototype.multiplymapvariable = function(mapvariable, value) {
	ICF.MainUtility.MultiplyCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Map.prototype.dividemapvariable = function(mapvariable, value) {
	ICF.MainUtility.DivideCustomVariable(this._mapId, 0, mapvariable, value);
}

Game_Map.prototype.modmapvariable = function(mapvariable, value) {
	ICF.MainUtility.ModCustomVariable(this._mapId, 0, mapvariable, value);
}

//=============================================================================
// Game_Item
//=============================================================================

Game_Item.prototype.traitDataTypes = function(code) {
	var data = this.object();
	if ((data == null)||(!data.traits)) return [];
	data = data.traits;
	return data.reduce(function(r, obj) {
		if (obj.code == code) return r.concat([obj.dataId]);
		return r;
	}, []).removeRepeated();
}

Game_Item.prototype.traitDataTypesOffset = function(code, min, max) {
	var data = this.object();
	if ((data == null)||(!data.traits)) return [];
	data = data.traits;
	return data.reduce(function(r, obj) {
		if ((obj.code == code)&&(obj.dataId >= min)&&(obj.dataId <= max)) return r.concat([obj.dataId - min]);
		return r;
	}, []).removeRepeated();
}

Game_Item.prototype.traitDataTypesMod = function(code, mod) {
	var data = this.object();
	if ((data == null)||(!data.traits)) return [];
	data = data.traits;
	return data.reduce(function(r, obj) {
		if (obj.code == code) return r.concat([obj.dataId % mod]);
		return r;
	}, []).removeRepeated();
}

//=============================================================================
// Game_Interpreter
//=============================================================================

Game_Interpreter.prototype.event = function() {
	return $gameMap.event(this._eventId);
};

ICF.MainUtility.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
        ICF.MainUtility.pluginCommand.call(this, command, args);
	if (command.toLowerCase() == 'selfswitch') {
		ICF.MainUtility.CustomSwitch(this._mapId, this._eventId, args[0], args[1]);
	} else if (command.toLowerCase() == 'mapswitch') {
		ICF.MainUtility.CustomSwitch(this._mapId, 0, args[0], args[1]);
	} else if (command.toLowerCase() == 'remoteswitch') {
		ICF.MainUtility.CustomSwitch(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase().match(/((?:actor)|(?:partymember))(switch)/i)&&(RegExp.$1.length + RegExp.$2.length == command.length)) {
		var actor = (RegExp.$1 == "actor")? args[0] : ($gameParty.members()[args[0]])? $gameParty.members()[args[0]]._actorId : 0;
		if (actor > 0) {ICF.MainUtility.CustomSwitch(0, actor, args[1], args[2]);}
	} else if (command.toLowerCase() == 'enemyswitch') {
		ICF.MainUtility.CustomSwitch("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'battleswitch') {
		ICF.MainUtility.BattleSwitch(0, 0, args[0], args[1]);
	} else if (command.toLowerCase().match(/((?:actor)|(?:partymember))(battleswitch)/i)&&(RegExp.$1.length + RegExp.$2.length == command.length)) {
		var actor = (RegExp.$1 == "actor")? args[0] : ($gameParty.members()[args[0]])? $gameParty.members()[args[0]]._actorId : 0;
		if (actor > 0) {ICF.MainUtility.BattleSwitch(0, actor, args[1], args[2]);}
	} else if (command.toLowerCase() == 'enemybattleswitch') {
		ICF.MainUtility.BattleSwitch("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase().match(/((?:self)|(?:map))(variable)/i)&&(RegExp.$1.length + RegExp.$2.length == command.length)) {
		var event = (RegExp.$1 == "self")? this._eventId : 0;
		ICF.MainUtility.CustomVariable(this._mapId, event, args[0], args[1]);
	} else if (command.toLowerCase().match(/(increase)((?:self)|(?:map))(variable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var event = (RegExp.$2 == "self")? this._eventId : 0;
		ICF.MainUtility.IncreaseCustomVariable(this._mapId, event, args[0], args[1]);
	} else if (command.toLowerCase().match(/(multiply)((?:self)|(?:map))(variable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var event = (RegExp.$2 == "self")? this._eventId : 0;
		ICF.MainUtility.MultiplyCustomVariable(this._mapId, event, args[0], args[1]);
	} else if (command.toLowerCase().match(/(divide)((?:self)|(?:map))(variable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var event = (RegExp.$2 == "self")? this._eventId : 0;
		ICF.MainUtility.DivideCustomVariable(this._mapId, event, args[0], args[1]);
	} else if (command.toLowerCase().match(/(mod)((?:self)|(?:map))(variable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var event = (RegExp.$2 == "self")? this._eventId : 0;
		ICF.MainUtility.ModCustomVariable(this._mapId, event, args[0], args[1]);
	} else if (command.toLowerCase() == 'remotevariable') {
		ICF.MainUtility.CustomVariable(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase() == 'increaseremotevariable') {
		ICF.MainUtility.IncreaseCustomVariable(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase() == 'multiplyremotevariable') {
		ICF.MainUtility.MultiplyCustomVariable(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase() == 'divideremotevariable') {
		ICF.MainUtility.DivideCustomVariable(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase() == 'modremotevariable') {
		ICF.MainUtility.ModCustomVariable(args[0], args[1], args[2], args[3]);
	} else if (command.toLowerCase() == 'actorvariable') {
		ICF.MainUtility.CustomVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'increaseactorvariable') {
		ICF.MainUtility.IncreaseCustomVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'multiplyactorvariable') {
		ICF.MainUtility.MultiplyCustomVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'divideactorvariable') {
		ICF.MainUtility.DivideCustomVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'modactorvariable') {
		ICF.MainUtility.ModCustomVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'enemyvariable') {
		ICF.MainUtility.CustomVariable("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'increaseenemyvariable') {
		ICF.MainUtility.IncreaseCustomVariable("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'multiplyenemyvariable') {
		ICF.MainUtility.MultiplyCustomVariable("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'divideenemyvariable') {
		ICF.MainUtility.DivideCustomVariable("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'modenemyvariable') {
		ICF.MainUtility.ModCustomVariable("e", args[0], args[1], args[2]);
	} else if (command.toLowerCase().match(/(enemy)?(battlevariable)/i)&&(RegExp.$1.length + RegExp.$2.length == command.length)) {
		if (RegExp.$1 == "enemy") {ICF.MainUtility.BattleVariable("e", args[0], args[1], args[2]);}
		else {ICF.MainUtility.BattleVariable(0, 0, args[0], args[1]);}
	} else if (command.toLowerCase().match(/(increase)(enemy)?(battlevariable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		if (RegExp.$2 == "enemy") {ICF.MainUtility.IncreaseBattleVariable("e", args[0], args[1], args[2]);}
		else {ICF.MainUtility.IncreaseBattleVariable(0, 0, args[0], args[1]);}
	} else if (command.toLowerCase().match(/(multiply)(enemy)?(battlevariable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		if (RegExp.$2 == "enemy") {ICF.MainUtility.MultiplyBattleVariable("e", args[0], args[1], args[2]);}
		else {ICF.MainUtility.MultiplyBattleVariable(0, 0, args[0], args[1]);}
	} else if (command.toLowerCase().match(/(divide)(enemy)?(battlevariable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		if (RegExp.$2 == "enemy") {ICF.MainUtility.DivideBattleVariable("e", args[0], args[1], args[2]);}
		else {ICF.MainUtility.DivideBattleVariable(0, 0, args[0], args[1]);}
	} else if (command.toLowerCase().match(/(mod)(enemy)?(battlevariable)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		if (RegExp.$2 == "enemy") {ICF.MainUtility.ModBattleVariable("e", args[0], args[1], args[2]);}
		else {ICF.MainUtility.ModBattleVariable(0, 0, args[0], args[1]);}
	} else if (command.toLowerCase() == 'actorbattlevariable') {
		ICF.MainUtility.BattleVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'increaseactorbattlevariable') {
		ICF.MainUtility.IncreaseBattleVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'multiplyactorbattlevariable') {
		ICF.MainUtility.MultiplyBattleVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'divideactorbattlevariable') {
		ICF.MainUtility.DivideBattleVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase() == 'modactorbattlevariable') {
		ICF.MainUtility.ModBattleVariable(0, args[0], args[1], args[2]);
	} else if (command.toLowerCase().match(/((?:actor)|(?:enemy)|(?:partymember))(trait)((?:add)|(?:rate)|(?:plus))?/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$1 == "actor")? $gameActors.actor(args[0])._traitsObject : (RegExp.$1 == "enemy")? $gameTroop.members()[args[0]]._traitsObject : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]]._traitsObject : undefined;
		var mode = (RegExp.$3 == "add")? 0 : (RegExp.$3 == "plus")? 2 : (RegExp.$3 == "rate")? 3 : 1;
		ICF.MainUtility.addTrait(data, mode, args[1], args[2], args[3]);
	} else if (command.toLowerCase().match(/(remove)((?:actor)|(?:enemy)|(?:partymember))(trait)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0])._traitsObject : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]]._traitsObject : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]]._traitsObject : undefined;
		ICF.MainUtility.removeTrait(data, args[1], args[2]);
	} else if (command.toLowerCase().match(/(clear)((?:actor)|(?:enemy)|(?:partymember))(traits)/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (data) data.clearTraits();
	} else if (command.toLowerCase().match(/(add)((?:actor)|(?:enemy)|(?:partymember))((?:tag)|(?:tags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (!data) return;
		if (args.length == 2) data.addTag(args[1]);
		else { 
			args.shift();
			data.addTags(args);
		}
	} else if (command.toLowerCase().match(/(remove)((?:actor)|(?:enemy)|(?:partymember))((?:tag)|(?:tags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (!data) return;
		if (args.length == 2) data.removeTag(args[1]);
		else { 
			args.shift();
			data.removeTags(args);
		}
	} else if (command.toLowerCase().match(/(clear)((?:actor)|(?:enemy)|(?:partymember))((?:tag)|(?:tags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (data) data.clearTags();
	} else if (command.toLowerCase().match(/(add)((?:actor)|(?:enemy)|(?:partymember))((?:battletag)|(?:battletags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (!data) return;
		if (args.length == 2) data.addBattleTag(args[1]);
		else { 
			args.shift();
			data.addBattleTags(args);
		}
	} else if (command.toLowerCase().match(/(remove)((?:actor)|(?:enemy)|(?:partymember))((?:battletag)|(?:battletags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (!data) return;
		if (args.length == 2) data.removeBattleTag(args[1]);
		else { 
			args.shift();
			data.removeBattleTags(args);
		}
	} else if (command.toLowerCase().match(/(clear)((?:actor)|(?:enemy)|(?:partymember))((?:battletag)|(?:battletags))/i)&&(RegExp.$1.length + RegExp.$2.length + RegExp.$3.length == command.length)) {
		var data = (RegExp.$2 == "actor")? $gameActors.actor(args[0]) : (RegExp.$2 == "enemy")? $gameTroop.members()[args[0]] : ($gameParty.members().length > args[0])? $gameParty.members()[args[0]] : undefined;
		if (data) data.clearBattleTags();
        }
};

//=============================================================================
// Game_System
//=============================================================================

ICF.MainUtility.GSystemInit = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
        ICF.MainUtility.GSystemInit.call(this);
        this._icf = {};
};

Game_System.prototype.ICF = function() {
    if (!this._icf) this._icf = {};
    return this._icf;
};

//=============================================================================
// Game_Temp
//=============================================================================

if (!Imported.ICFSoft_MainCore) {
    Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
	if (!this._commontEventArray) this._commontEventArray = [];
	this._commontEventArray.push(commonEventId);
    };

    Game_Temp.prototype.clearCommonEvent = function() {
	if (!this._commontEventArray) this._commontEventArray = [];
	this._commontEventArray.splice(0, 1);
    };

    Game_Temp.prototype.isCommonEventReserved = function() {
	if (!this._commontEventArray) this._commontEventArray = [];
	return this._commontEventArray.length > 0;
    };

    Game_Temp.prototype.reservedCommonEvent = function() {
	if (!this._commontEventArray) this._commontEventArray = [];
	return $dataCommonEvents[this._commontEventArray[0]];
    };
}

//=============================================================================
// Utilities
//=============================================================================

ICF.MainUtility.gettfield = function(array) {
	if (array.length < 2) return [];
	for (var i = 0; i < ICF.MainUtility.traittags.length; i++) {
		if (array[0].toLowerCase() == ICF.MainUtility.traittags[i][0]) {
			array[0] = ICF.MainUtility.traittags[i][1];
			array[1] = Number(array[1]) + ICF.MainUtility.traittags[i][2];
			break;
		}
	}
	if (isNaN(Number(array[0]))) {return [-1];}
	return array;
}

ICF.MainUtility.getefield = function(array) {
	if (array.length < 4) return [];
	for (var i = 0; i < ICF.MainUtility.effecttags.length; i++) {
		if (array[0].toLowerCase() == ICF.MainUtility.effecttags[i][0]) {
			array[0] = ICF.MainUtility.effecttags[i][1];
			array[1] = Number(array[1]) + ICF.MainUtility.effecttags[i][2];
			break;
		}
	}
	if (isNaN(Number(array[0]))) {return [-1];}
	return array;
}

ICF.MainUtility.addTrait = function(data, mode, code, dataid, value) {
	if (!data || !data.traits) return;
	var array = [code, Number(dataid), Number(value)];
	if (isNaN(Number(array[0]))) {array = ICF.MainUtility.gettfield(array);};
	if (array[0] < 0) {return;};
	if (mode == 0) {data.traits.push({code:Number(array[0]), dataId:array[1], value:array[2]}); return;};
	var ind = -1;
	for (var i = 0; i < data.traits.length; i++) {
		if ((data.traits[i].code == array[0])&&(data.traits[i].dataId == array[1])) {
			ind = i;
			break;
		}
	}
	if (ind == -1) {data.traits.push({code:Number(array[0]), dataId:array[1], value:array[2]}); return;};
	if (mode == 1) {
		data.traits[ind].value = array[2];
		for (var i = data.traits.length - 1; i > ind; i--) {
			if ((data.traits[i].code == array[0])&&(data.traits[i].dataId == array[1])) {
				data.traits.splice(i, 1);
			}
		}
	} else if (mode == 2){
		data.traits[ind].value += array[2];
		for (var i = data.traits.length - 1; i > ind; i--) {
			if ((data.traits[i].code == array[0])&&(data.traits[i].dataId == array[1])) {
				data.traits[ind].value += data.traits[i].value;
				data.traits.splice(i, 1);
			}
		}
	} else if (mode == 3){
		data.traits[ind].value *= array[2];
		for (var i = data.traits.length - 1; i > ind; i--) {
			if ((data.traits[i].code == array[0])&&(data.traits[i].dataId == array[1])) {
				data.traits[ind].value *= data.traits[i].value;
				data.traits.splice(i, 1);
			}
		}
	}
}

ICF.MainUtility.removeTrait = function(data, code, dataid) {
	if (!data.traits) return;
	var array = [code, Number(dataid), 0];
	if (isNaN(Number(array[0]))) {array = ICF.MainUtility.gettfield(array);};
	if (array[0] < 0) {return;};
	var ind = -1;
	for (var i = data.traits.length - 1; i >= 0; i--) {
		if ((data.traits[i].code == array[0])&&(data.traits[i].dataId == array[1])) {
			data.traits.splice(i, 1);
		}
	}
}

ICF.MainUtility.CustomSwitch = function(mapid, evid, switchname, value) {
	var _key = [mapid, evid, switchname];
	var _value = (value.toString().toLowerCase() === "true");
	$gameSelfSwitches.setValue(_key, _value);
}

ICF.MainUtility.CustomVariable = function(mapid, evid, variablename, value) {
	var _key = [mapid, evid, variablename];
	$gameSelfVariables.setValue(_key, value);
}

ICF.MainUtility.IncreaseCustomVariable = function(mapid, evid, variablename, value) {
	var _key = [mapid, evid, variablename];
	$gameSelfVariables.increaseValue(_key, value);
}

ICF.MainUtility.MultiplyCustomVariable = function(mapid, evid, variablename, value) {
	var _key = [mapid, evid, variablename];
	$gameSelfVariables.multiplyValue(_key, value);
}

ICF.MainUtility.DivideCustomVariable = function(mapid, evid, variablename, value) {
	var _key = [mapid, evid, variablename];
	$gameSelfVariables.divideValue(_key, value);
}

ICF.MainUtility.ModCustomVariable = function(mapid, evid, variablename, value) {
	var _key = [mapid, evid, variablename];
	$gameSelfVariables.modValue(_key, value);
}

ICF.MainUtility.BattleSwitch = function(code, evid, switchname, value) {
	var _key = [code, evid, switchname];
	var _value = (value.toString().toLowerCase() === "true");
	$gameBattleSwitches.setValue(_key, _value);
}

ICF.MainUtility.BattleVariable = function(code, evid, variablename, value) {
	var _key = [code, evid, variablename];
	$gameBattleVariables.setValue(_key, value);
}

ICF.MainUtility.IncreaseBattleVariable = function(code, evid, variablename, value) {
	var _key = [code, evid, variablename];
	$gameBattleVariables.increaseValue(_key, value);
}

ICF.MainUtility.MultiplyBattleVariable = function(code, evid, variablename, value) {
	var _key = [code, evid, variablename];
	$gameBattleVariables.multiplyValue(_key, value);
}

ICF.MainUtility.DivideBattleVariable = function(code, evid, variablename, value) {
	var _key = [code, evid, variablename];
	$gameBattleVariables.divideValue(_key, value);
}

ICF.MainUtility.ModBattleVariable = function(code, evid, variablename, value) {
	var _key = [code, evid, variablename];
	$gameBattleVariables.modValue(_key, value);
}

ICF.MainUtility.CheckVar = function(code, value1, value2) {
	switch (code) {
		case 0:
			return (value1 == value2); break;
		case 1:
			return (value1 !== value2); break;
		case 2:
			return (value1 > value2); break;
		case 3:
			return (value1 >= value2); break;
		case 4:
			return (value1 < value2); break;
		case 5:
			return (value1 <= value2); break;
		default:
			return false;
	}
}

Array.range = function() {
    var args = arguments;
    if (args.length < 1) return [];
    var x = [];
    if (args.length == 1) {
	if (args[0] == 0) return [0];
	if (args[0] > 0) for (var i = 1; i <= args[0]; i++) {
		x.push(i);
	} else for (var i = -1; i >= args[0]; i--) {
		x.push(i);
	}
    } else if (args.length == 2) {
	if (args[0] < args[1]) for (var i = args[0]; i <= args[1]; i++) {
		x.push(i);
	} else for (var i = args[0]; i >= args[1]; i--) {
		x.push(i);
	}
    } else {
	if (args[0] < args[1] && args[2] > 0) for (var i = args[0]; i <= args[1]; i += args[2]) {
		x.push(i);
	} else if (args[0] > args[1] && args[2] < 0) for (var i = args[0]; i >= args[1]; i += args[2]) {
		x.push(i);
	}
    }
    return x;
};

Array.coincidences = function() {
    var args = arguments;
    if (args.length < 1) return [];
    if (args.length == 1) return args[0];
    var x = [];
    for (var i = 0; i < args[0].length; i++) {
	if (args[1].indexOf(args[0][i]) > -1) x.push(args[0][i]);
    }
    if (args.length == 2) return x.removeRepeated();
    for (var i = x.length - 1; i >= 0; i--) {
	for (var il = 2; il < args.length; il++) {
		if (args[il].indexOf(x[i]) == -1) {
			x.splice(i,1);
			break;
		}
	}
    }
    return x.removeRepeated();
};

Array.prototype.removeRepeated = function() {
    this.sort(function(a, b) { return a - b;});
    for (var i = this.length - 1; i > 0; i--) {
       if (this[i] == this[i - 1]) this.splice(i,1);
    }
    return this;
};

Array.prototype.clean = function() {
    for (var i = this.length - 1; i >= 0; i -= 1) {
	if (this[i] == null) this.splice(i,1);
	if (String(this[i]).length == 0) this.splice(i,1);
    }
    return this;
};

Array.prototype.cleanAll = function() {
    for (var i = this.length - 1; i >= 0; i -= 1) {
	if (this[i] == null) this.splice(i,1);
	if (String(this[i]).length == 0) this.splice(i,1);
	if (Array.isArray(this[i])) this[i].cleanAll();
    }
    return this;
};

Array.prototype.cleaned = function() {
    var x = [];
    for (var i = 0; i < this.length; i++) {
	if (this[i] != null) x.push(this[i]);
    }
    return x;
};

Array.prototype.cleanedAll = function() {
    var x = [];
    var y = [];
    for (var i = 0; i < this.length; i++) {
	if (Array.isArray(this[i])) {
		y = this[i].cleanedAll();
		if (y.length > 0) x.push(y);
	} else if (this[i] != null) x.push(this[i]);
    }
    return x;
};

Array.prototype.extend = function() {
    this.clean();
    for (var i = this.length - 2; i > 0; i -= 1) {
	if ((String(this[i]).match(/((?:to)|(?:a)|(?:hasta))/i))&&(RegExp.$1.length == String(this[i]).length)) {
		eval("this.splice(i - 1,3," + Array.range(Number(this[i - 1]), Number(this[i + 1])).join() + ")");
		i--;
	}
    }
    return this;
};

Array.prototype.fixedBlocks = function(block) {
    if ((this.length % block)  > 0) {
	eval("this.splice(this.length,0," + new Array(block - this.length % block).join() + ")");
    }
};

Array.prototype.leaveNumbers = function() {
    for (var i = this.length - 1; i >= 0; i -= 1) {
	if (isNaN(Number(this[i]))) this.splice(i,1);
	else this[i] = Number(this[i]);
    }
    return this;
};

Array.prototype.numbers = function() {
    var x = [];
    for (var i = 0; i < this.length; i++) {
	if (!isNaN(Number(this[i]))) x.push(Number(this[i]));
    }
    return x;
};

Array.prototype.reduceToFit = function() {
    var args = arguments;
    if (args.length < 1) return this;
    for (var i = 0; i < args.length; i++) {
	if ((Array.isArray(args[i]))&&(args[i].length < this.length)) this.splice(args[i].length, this.length - args[i].length);
    }
    return this;
};

String.prototype.doubleSplit = function() {
    var x = this.split(",");
    for (var i = 0; i < x.length; i++) {
	x[i] = x[i].split(/\s+/);
    }
    return x;
}

String.prototype.doubleSplitNumbers = function() {
    var x = this.doubleSplit();
    for (var i = x.length - 1; i >= 0; i--) {
	x[i] = x[i].extend().numbers();
	if (x[i].length < 1) x.splice(i,1);
    }
    return x;
}

Number.prototype.percentage = function(decimals) {
    return (this * 100).toFixed(decimals) + "%";
}

Date.prototype.getMonthAndDay = function() {
    return this.getMonth() * 100 + this.getDate() + 100;
};

Date.prototype.getHourAndMinute = function() {
    return this.getHours() * 100 + this.getMinutes();
};

Date.prototype.getDayMinutes = function() {
    return this.getHours() * 60 + this.getMinutes();
};

Date.prototype.increaseMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
};

//=============================================================================
// End of File
//=============================================================================
//
//            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
//                require('nw.gui').Window.get().showDevTools();
//          }
//