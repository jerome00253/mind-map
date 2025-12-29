// Liste des polices
export const fontFamilyList = [
  {
    name: 'Song Ti',
    value: '宋体, SimSun, Songti SC'
  },
  {
    name: 'Microsoft Yahei',
    value: '微软雅黑, Microsoft YaHei'
  },
  {
    name: 'Italique',
    value: '楷体, 楷体_GB2312, SimKai, STKaiti'
  },
  {
    name: 'Gras',
    value: '黑体, SimHei, Heiti SC'
  },
  {
    name: 'Script officiel',
    value: '隶书, SimLi'
  },
  {
    name: 'Andale Mono',
    value: 'andale mono'
  },
  {
    name: 'Arial',
    value: 'arial, helvetica, sans-serif'
  },
  {
    name: 'Arial Black',
    value: 'arial black, avant garde'
  },
  {
    name: 'Comic Sans Ms',
    value: 'comic sans ms'
  },
  {
    name: 'Impact',
    value: 'impact, chicago'
  },
  {
    name: 'Times New Roman',
    value: 'times new roman'
  },
  {
    name: 'Sans-Serif',
    value: 'sans-serif'
  },
  {
    name: 'Serif',
    value: 'serif'
  }
]

// Style de bordure
export const borderDasharrayList = [
  {
    name: 'Solide',
    value: 'none'
  },
  {
    name: 'Pointillés 1',
    value: '5,5'
  },
  {
    name: 'Pointillés 2',
    value: '10,10'
  },
  {
    name: 'Pointillés 3',
    value: '20,10,5,5,5,10'
  },
  {
    name: 'Pointillés 4',
    value: '5,5,1,5'
  },
  {
    name: 'Pointillés 5',
    value: '15,10,5,10,15'
  },
  {
    name: 'Pointillés 6',
    value: '1,5'
  },
  {
    name: 'Pointillés 7',
    value: '6,4'
  }
]

// Style de ligne
export const lineStyleList = [
  {
    name: 'Droite',
    value: 'straight'
  },
  {
    name: 'Courbe',
    value: 'curve'
  },
  {
    name: 'Directe',
    value: 'direct'
  }
]

// Style courbe, si le nœud racine garde le même style
export const rootLineKeepSameInCurveList = [
  {
    name: 'Crochet',
    value: false
  },
  {
    name: 'Accolade',
    value: true
  }
]

// Répétition de l'image
export const backgroundRepeatList = [
  {
    name: 'Ne pas répéter',
    value: 'no-repeat'
  },
  {
    name: 'Répéter',
    value: 'repeat'
  },
  {
    name: 'Répéter-x',
    value: 'repeat-x'
  },
  {
    name: 'Répéter-y',
    value: 'repeat-y'
  }
]

// Position de l'image de fond
export const backgroundPositionList = [
  {
    name: 'Par défaut',
    value: '0% 0%'
  },
  {
    name: 'En haut à gauche',
    value: 'left top'
  },
  {
    name: 'Au centre à gauche',
    value: 'left center'
  },
  {
    name: 'En bas à gauche',
    value: 'left bottom'
  },
  {
    name: 'En haut à droite',
    value: 'right top'
  },
  {
    name: 'Au centre à droite',
    value: 'right center'
  },
  {
    name: 'En bas à droite',
    value: 'right bottom'
  },
  {
    name: 'En haut au centre',
    value: 'center top'
  },
  {
    name: 'Au centre',
    value: 'center center'
  },
  {
    name: 'En bas au centre',
    value: 'center bottom'
  }
]

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const ctrl = isMac ? '⌘' : 'Ctrl'
const enter = isMac ? 'Return' : 'Entrée'
const macFn = isMac ? 'fn + ' : ''

// Taille de l'image de fond
export const backgroundSizeList = [
  {
    name: 'Auto',
    value: 'auto'
  },
  {
    name: 'Couvrir',
    value: 'cover'
  },
  {
    name: 'Contenir',
    value: 'contain'
  }
]

// Liste des raccourcis clavier
export const shortcutKeyList = [
  {
    type: 'Opérations sur les nœuds',
    list: [
      {
        icon: 'icontianjiazijiedian',
        name: 'Insérer un nœud enfant',
        value: 'Tab | Insert'
      },
      {
        icon: 'iconjiedian',
        name: 'Insérer un nœud frère',
        value: enter
      },
      {
        icon: 'icondodeparent',
        name: 'Insérer un nœud parent',
        value: 'Shift + Tab'
      },
      {
        icon: 'iconshangyi',
        name: 'Déplacer vers le haut',
        value: `${ctrl} + ↑`
      },
      {
        icon: 'iconxiayi',
        name: 'Déplacer vers le bas',
        value: `${ctrl} + ↓`
      },
      {
        icon: 'icongaikuozonglan',
        name: 'Insérer un résumé',
        value: `${ctrl} + G`
      },
      {
        icon: 'iconzhankai',
        name: 'Développer/Réduire',
        value: '/'
      },
      {
        icon: 'iconshanchu',
        name: 'Supprimer le nœud',
        value: 'Delete | Backspace'
      },
      {
        icon: 'iconshanchu',
        name: 'Supprimer uniquement le nœud actuel',
        value: 'Shift + Backspace'
      },
      {
        icon: 'iconfuzhi',
        name: 'Copier le nœud',
        value: `${ctrl} + C`
      },
      {
        icon: 'iconjianqie',
        name: 'Couper le nœud',
        value: `${ctrl} + X`
      },
      {
        icon: 'iconniantie',
        name: 'Coller le nœud',
        value: `${ctrl} + V`
      },
      {
        icon: 'iconbianji',
        name: 'Éditer le nœud',
        value: macFn + 'F2'
      },
      {
        icon: 'iconhuanhang',
        name: 'Retour à la ligne',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconhoutui-shi',
        name: 'Annuler',
        value: `${ctrl} + Z`
      },
      {
        icon: 'iconqianjin1',
        name: 'Rétablir',
        value: `${ctrl} + Y`
      },
      {
        icon: 'iconquanxuan',
        name: 'Tout sélectionner',
        value: `${ctrl} + A`
      },
      {
        icon: 'iconquanxuan',
        name: 'Sélection multiple',
        value: `Clic droit / ${ctrl} + Clic gauche`
      },
      {
        icon: 'iconzhengli',
        name: 'Organiser la disposition',
        value: `${ctrl} + L`
      },
      {
        icon: 'iconsousuo',
        name: 'Rechercher et remplacer',
        value: `${ctrl} + F`
      }
    ]
  },
  {
    type: 'Opérations sur le canevas',
    list: [
      {
        icon: 'iconfangda',
        name: 'Zoomer',
        value: `${ctrl} + +`
      },
      {
        icon: 'iconsuoxiao',
        name: 'Dézoomer',
        value: `${ctrl} + -`
      },
      {
        icon: 'iconfangda',
        name: 'Zoomer/Dézoomer',
        value: `${ctrl} + Molette de la souris`
      },
      {
        icon: 'icondingwei',
        name: 'Retour au nœud racine',
        value: `${ctrl} + ${enter}`
      },
      {
        icon: 'iconquanping1',
        name: 'Ajuster au canevas',
        value: `${ctrl} + i`
      }
    ]
  },
  {
    type: 'Opérations sur le plan',
    list: [
      {
        icon: 'iconhuanhang',
        name: 'Retour à la ligne',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconshanchu',
        name: 'Supprimer le nœud actuel',
        value: 'Delete'
      },
      {
        icon: 'icontianjiazijiedian',
        name: 'Insérer un nœud enfant',
        value: 'Tab'
      },
      {
        icon: 'iconjiedian',
        name: 'Insérer un nœud frère',
        value: enter
      },
      {
        icon: 'icondodeparent',
        name: 'Monter d\'un niveau',
        value: 'Shift + Tab'
      }
    ]
  }
]

// Liste des formes
export const shapeList = [
  {
    name: 'Rectangle',
    value: 'rectangle'
  },
  {
    name: 'Losange',
    value: 'diamond'
  },
  {
    name: 'Parallélogramme',
    value: 'parallelogram'
  },
  {
    name: 'Rectangle arrondi',
    value: 'roundedRectangle'
  },
  {
    name: 'Rectangle octogonal',
    value: 'octagonalRectangle'
  },
  {
    name: 'Rectangle triangulaire externe',
    value: 'outerTriangularRectangle'
  },
  {
    name: 'Rectangle triangulaire interne',
    value: 'innerTriangularRectangle'
  },
  {
    name: 'Ellipse',
    value: 'ellipse'
  },
  {
    name: 'Cercle',
    value: 'circle'
  }
]

// Liste de la barre latérale
export const sidebarTriggerList = [
  {
    name: 'Nœud',
    value: 'nodeStyle',
    icon: 'iconzhuti'
  },
  {
    name: 'Style',
    value: 'baseStyle',
    icon: 'iconyangshi'
  },
  {
    name: 'Thème',
    value: 'theme',
    icon: 'iconjingzi'
  },
  {
    name: 'Structure',
    value: 'structure',
    icon: 'iconjiegou'
  },
  {
    name: 'Plan',
    value: 'outline',
    icon: 'iconfuhao-dagangshu'
  },
  {
    name: 'Options',
    value: 'setting',
    icon: 'iconshezhi'
  }
]

// Liste des types de téléchargement
export const downTypeList = [
  {
    name: 'Fichier SimpleMindMap',
    type: 'smm',
    icon: 'iconwenjian',
    desc: 'Format privé SimpleMindMap, peut être utilisé pour la ré-importation, le client peut directement l\'éditer'
  },
  {
    name: 'Image',
    type: 'png',
    icon: 'iconPNG',
    desc: 'Formats d\'image courants, adaptés à la visualisation et au partage'
  },
  {
    name: 'SVG',
    type: 'svg',
    icon: 'iconSVG',
    desc: 'Graphiques vectoriels évolutifs'
  },
  {
    name: 'PDF',
    type: 'pdf',
    icon: 'iconpdf',
    desc: 'Adapté à la visualisation, à la navigation et à l\'impression'
  },
  {
    name: 'Markdown',
    type: 'md',
    icon: 'iconmarkdown',
    desc: 'Format de texte MD, facile à ouvrir avec d\'autres logiciels'
  },
  {
    name: 'XMind',
    type: 'xmind',
    icon: 'iconxmind',
    desc: 'Format du logiciel XMind'
  },
  {
    name: 'Txt',
    type: 'txt',
    icon: 'iconTXT',
    desc: 'Fichier texte brut'
  },
  {
    name: 'Excel',
    type: 'xlsx',
    icon: 'iconfile-excel',
    desc: 'Format de texte de tableau, modifiable avec le logiciel Excel'
  },
  {
    name: 'FreeMind',
    type: 'mm',
    icon: 'iconfreemind',
    desc: 'Format du logiciel FreeMind'
  },
  {
    name: 'JSON',
    type: 'json',
    icon: 'iconjson',
    desc: 'Format d\'échange de données populaire, peut être utilisé pour la ré-importation'
  }
]

// Liste des types de numérotation
export const numberTypeList = [
  {
    name: 'Aucun',
    value: ''
  },
  {
    name: '1, 2, 3',
    value: 1
  },
  {
    name: '1., 2., 3.',
    value: 2
  },
  {
    name: '(1), (2), (3)',
    value: 3
  },
  {
    name: 'a., b., c.',
    value: 4
  },
  {
    name: 'A., B., C.',
    value: 5
  },
  {
    name: 'i., ii., iii.',
    value: 6
  },
  {
    name: 'I., II., III.',
    value: 7
  },
  {
    name: '一、, 二、, 三、',
    value: 8
  }
]

// Liste des niveaux de numérotation
export const numberLevelList = [
  {
    name: '1 niveau',
    value: 1
  },
  {
    name: '2 niveaux',
    value: 2
  },
  {
    name: '3 niveaux',
    value: 3
  },
  {
    name: 'Tous les niveaux',
    value: 0
  }
]

// Direction du dégradé de fond
export const linearGradientDirList = [
  {
    name: 'De gauche à droite',
    value: '1',
    start: [0, 0],
    end: [1, 0]
  },
  {
    name: 'De droite à gauche',
    value: '2',
    start: [1, 0],
    end: [0, 0]
  },
  {
    name: 'De haut en bas',
    value: '3',
    start: [0, 0],
    end: [0, 1]
  },
  {
    name: 'De bas en haut',
    value: '4',
    start: [0, 1],
    end: [0, 0]
  },
  {
    name: 'De haut gauche à bas droite',
    value: '5',
    start: [0, 0],
    end: [1, 1]
  },
  {
    name: 'De bas gauche à haut droite',
    value: '6',
    start: [0, 1],
    end: [1, 0]
  },
  {
    name: 'De haut droite à bas gauche',
    value: '7',
    start: [1, 0],
    end: [0, 1]
  },
  {
    name: 'De bas droite à haut gauche',
    value: '8',
    start: [1, 1],
    end: [0, 0]
  }
]

// Alignement du texte
export const alignList = [
  {
    name: 'Aligner à gauche',
    value: 'left'
  },
  {
    name: 'Aligner au centre',
    value: 'center'
  },
  {
    name: 'Aligner à droite',
    value: 'right'
  }
]

// Liste des structures
export const layoutGroupList = [
  {
    name: 'Structure logique',
    list: ['logicalStructure', 'logicalStructureLeft']
  },
  {
    name: 'Carte mentale',
    list: ['mindMap']
  },
  {
    name: 'Organigramme',
    list: ['organizationStructure']
  },
  {
    name: 'Organisation catalogue',
    list: ['catalogOrganization']
  },
  {
    name: 'Chronologie',
    list: [
      'timeline',
      'timeline2',
      'verticalTimeline'
    ]
  },
  {
    name: 'Diagramme en arête de poisson',
    list: ['fishbone']
  }
]
