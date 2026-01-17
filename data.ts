
import { MenuData } from './types';

export const INITIAL_MENU: MenuData = {
  contacts: [
    { id: 'phone1', label: 'Telefone', value: '+351 281 325 175' }
  ],
  address: 'Largo da Caracolinha n.8, Tavira 8800-310',
  categories: [
    {
      id: 'entradas',
      title: { pt: 'Entradas', en: 'Starters', fr: 'Entrées', de: 'Vorspeisen' },
      items: [
        { id: 'e00', code: '00', name: { pt: 'Pão', en: 'Bread', fr: 'Pain', de: 'Brot' }, price: 1.20 },
        { id: 'e01', code: '01', name: { pt: 'Pão com Alho', en: 'Bread with garlic', fr: 'Pain à l\'ail', de: 'Brot mit knoblauch' }, price: 3.00 },
        { id: 'e02', code: '02', name: { pt: 'Pão com Alho e Queijo', en: 'Bread with garlic and cheese', fr: 'Pain à l\'ail et fromage', de: 'Brot mit knoblauch und käse' }, price: 4.00 },
        { id: 'e03', code: '03', name: { pt: 'Pão com Alho, Queijo e Fiambre', en: 'Bread with garlic, cheese and ham', fr: 'Pain à l\'ail, fromage et jambom', de: 'Brot mit knoblauch, käse und schinken' }, price: 4.50 },
        { id: 'e04', code: '04', name: { pt: 'Pão com alecrim', en: 'Rosemary bread', fr: 'Pain au romarin', de: 'Rosmarin-brot' }, price: 3.00 },
      ]
    },
    {
      id: 'massas',
      title: { pt: 'Massas', en: 'Pastas', fr: 'Pâtes', de: 'Nudeln' },
      items: [
        { id: 'm44', code: '44', name: { pt: 'Lasagne da Casa', en: 'House lasagne', fr: 'Lasagnes maison', de: 'Haus lasagne' }, price: 10.00 },
        { id: 'm45', code: '45', name: { pt: 'Esparguete à Bolonhesa', en: 'Bolognaise spaghetti', fr: 'Spagetthi à la bolognaise', de: 'Bolognaise spaghetti' }, price: 9.50 },
      ]
    },
    {
      id: 'empadas-calzone',
      title: { pt: 'Empadas Calzone', en: 'Calzone Pies', fr: 'Tourtes Calzone', de: 'Calzone-Pasteten' },
      items: [
        { id: 'c28', code: '28', name: { pt: 'Empadinha à bolonhesa', en: 'Bolognaise meat-pie', fr: 'Petit tourte bolognaise', de: 'Bolognese-fleischpastete' }, price: 9.00 },
        { id: 'c29', code: '29', name: { pt: 'Empadinha de carne kebab', en: 'Kebab meat-pie', fr: 'Petit tourte à la viande de kebab', de: 'Kebab-fleischpastete' }, price: 9.00 },
        { 
          id: 'c17', code: '17', 
          name: { pt: 'Ciao-Ciao (empada-pie)', en: 'Ciao-Ciao (empada-pie)', fr: 'Ciao-Ciao (empada-pie)', de: 'Ciao-Ciao (empada-pie)' }, 
          description: { 
            pt: 'Tomate, queijo, cogumelos, cebola, lombo de porco e alho', 
            en: 'Tomato, cheese, mushrooms, onions, pork fillet and garlic', 
            fr: 'Tomate, fromage, champignons, oignon, filet de porc et ail', 
            de: 'Tomaten, käse, pilze, zwiebeln, schweinefilet und Knoblauch' 
          }, 
          price: 10.00 
        },
      ]
    },
    {
      id: 'especialidades',
      title: { pt: 'Especialidades', en: 'Specialties', fr: 'Spécialités', de: 'Spezialitäten' },
      items: [
        { 
          id: 'spec25', code: '25', 
          name: { pt: 'Kebab no Pão', en: 'Kebab in Bread', fr: 'Kebab en Pain', de: 'Kebab im Brot' }, 
          description: { 
            pt: 'Alface, tomate, pepino, cebola, carne e molho de kebab', 
            en: 'Lettuce, tomato, cucumber, onions, meat and kebab sauce', 
            fr: 'Laitue, tomate fraîche concombre, oignon, viande de kebab et sauce de kebab', 
            de: 'Salat, tomaten, gurken, zwiebeln, fleisch and kebab-sauce' 
          }, 
          price: 8.00 
        },
        { 
          id: 'spec60', code: '60', 
          name: { pt: 'Rolo de Kebab', en: 'Kebab Roll', fr: 'Rouleau de Kebab', de: 'Kebab-Rolle' }, 
          description: { 
            pt: 'Alface, tomate, pepino, cebola, carne e molho de kebab', 
            en: 'Lettuce, tomato, cucumber, onions, meat and kebab sauce', 
            fr: 'Laitue, tomate fraîche, concombre, oignon, viande de kebab et sauce de kebab', 
            de: 'Salat, tomaten, gurken, zwiebeln, fleisch and kebab-sauce' 
          }, 
          price: 8.50 
        },
        { 
          id: 'spec61', code: '61', 
          name: { pt: 'Rolo de Frango', en: 'Chicken Roll', fr: 'Rouleau de Poulet', de: 'Hähnchen-Rolle' }, 
          description: { 
            pt: 'Alface, tomate, pepino, cebola, frango e molho de kebab', 
            en: 'Lettuce, tomato, cucumber, onions, chicken and kebab sauce', 
            fr: 'Laitue, tomate fraîche, concombre, oignon, poulet et sauce de kebab', 
            de: 'Salat, tomaten, gurken, zwiebeln, hühnchen und kebab-sauce' 
          }, 
          price: 8.50 
        },
      ]
    },
    {
      id: 'saladas',
      title: { pt: 'Saladas', en: 'Salads', fr: 'Salades', de: 'Salate' },
      items: [
        { 
          id: 's30', code: '30', 
          name: { pt: 'Salada Americana', en: 'American Salad', fr: 'Salade Américaine', de: 'Amerikanischer Salat' }, 
          description: { pt: 'Alface, tomate, pepino, fiambre, ananás e molho', en: 'Lettuce, tomato, cucumber, ham, pine-apple and sauce', fr: 'Laitue, tomate, concombre, jambon, ananas et sauce', de: 'Salat, tomate, gurke, schinken, kieferapfel und soße' }, 
          price: 8.50 
        },
        { 
          id: 's31', code: '31', 
          name: { pt: 'Salada Portuguesa', en: 'Portuguese Salad', fr: 'Salade Portugaise', de: 'Portugiesischer Salat' }, 
          description: { pt: 'Alface, tomate, pepino, cebola, queijo mozzarella, azeitonas e molho', en: 'Lettuce, tomato, cucumber, onions, cheese mozzarella, olives and sauce', fr: 'Laitue, tomate, concombre, oignon, fromage, olives et sauce', de: 'Salat, tomate, gurke, zwiebeln, käsemozzarella, oliven und soße' }, 
          price: 8.50 
        },
        { 
          id: 's32', code: '32', 
          name: { pt: 'Salada Tavira', en: 'Tavira Salad', fr: 'Salade Tavira', de: 'Tavira Salat' }, 
          description: { pt: 'Alface, tomate, pepino, cebola, atum, ovo e molho', en: 'Lettuce, tomato, cucumber, onions, tunafish, egg and sauce', fr: 'Laitue, tomate, concombre, oignon, thon, oeuf et sauce', de: 'Salat, tomaten, gurken, zwiebeln, thunfisch, ei und soße' }, 
          price: 8.50 
        },
        { 
          id: 's33', code: '33', 
          name: { pt: 'Salada Vegetariana', en: 'Vegetarian Salad', fr: 'Salade Végétarienne', de: 'Vegetarischer Salat' }, 
          description: { pt: 'Alface, tomate, pepino, cebola, cogumelos, milho, pimentos, azeitonas e molho', en: 'Lettuce, tomato, cucumber, onions, mushrooms, sweet corn, peppers, olives and sauce', fr: 'Laitue, tomate, concombre, oignons, champignons, maїs, piment vert, olives et sauce', de: 'Kopfsalat, tomate, gurke, zwiebeln, pilze, süßer mais, pfeffer, oliven und soße' }, 
          price: 8.50 
        },
        { 
          id: 's34', code: '34', 
          name: { pt: 'Salada de Galinha', en: 'Chicken Salad', fr: 'Salade de Poulet', de: 'Hähnchensalat' }, 
          description: { pt: 'Alface, tomate, pepino, galinha, milho, pimentos e molho', en: 'Lettuce, tomato, cucumber, chicken, sweet corn, peppers and sauce', fr: 'Laitue, tomate, concombre, poulet, maїs, piment vert et sauce', de: 'Kopfsalat, tomate, gurke, huhn, süßer mais, pfeffer und soße' }, 
          price: 8.50 
        },
        { 
          id: 's35', code: '35', 
          name: { pt: 'Salada Fenícia', en: 'Fenicia Salad', fr: 'Salade Phénicienne', de: 'Phönizischer Salat' }, 
          description: { pt: 'Alface, tomate, pepino, delicías, camarão, ovo e molho', en: 'Lettuce, tomato, cucumber, crab, prawns, egg and sauce', fr: 'Laitue, tomate, concombre, crevettes, surimi et sauce', de: 'Kopfsalat, tomate, gurke, krabbe, garnelen, ei und soße' }, 
          price: 9.00 
        },
        { 
          id: 's36', code: '36', 
          name: { pt: 'Salada Mista', en: 'Mixed Salad', fr: 'Salade Mixte', de: 'Gemischter Salat' }, 
          description: { pt: 'Alface, tomate, pepino, cebola e pimento', en: 'Lettuce, tomato, cucumber, onions and peppers', fr: 'Laitue, tomate, concombre, oignon e piment', de: 'Salat, tomaten, gurken, zwiebeln und paprika' }, 
          price: 4.95 
        },
      ]
    },
    {
      id: 'pizzas',
      title: { pt: 'Pizzas', en: 'Pizzas', fr: 'Pizzas', de: 'Pizzen' },
      items: [
        { 
          id: 'p1', code: '1', 
          name: { pt: 'Capriciosa', en: 'Capriciosa', fr: 'Capriciosa', de: 'Capriciosa' }, 
          description: { pt: 'Tomate, queijo, fiambre e cogumelos', en: 'Tomato, cheese, ham and mushrooms', fr: 'Tomate, fromage, jambon et champignons', de: 'Tomaten, käse, schinken und pilze' }, 
          price: 9.00 
        },
        { 
          id: 'p2', code: '2', 
          name: { pt: 'Milano', en: 'Milano', fr: 'Milano', de: 'Milano' }, 
          description: { pt: 'Tomate, queijo, fiambre', en: 'Tomato, cheese and ham', fr: 'Tomate, fromage et jambon', de: 'Tomaten, käse und schinken' }, 
          price: 8.75 
        },
        { 
          id: 'p4', code: '4', 
          name: { pt: 'Bolonhesa', en: 'Bolognaise', fr: 'Bolognaise', de: 'Bolognese' }, 
          description: { pt: 'Tomate, queijo, cebola e bolonhesa', en: 'Tomato, chesse, onions and bolognaise sauce', fr: 'Tomate, fromage, oignons et sauce bolognaise', de: 'Tomaten, käse, zwiebeln und bolognese-sauce' }, 
          price: 9.00 
        },
        { 
          id: 'p6', code: '6', 
          name: { pt: 'Amor', en: 'Amor', fr: 'Amor', de: 'Amor' }, 
          description: { pt: 'Tomate, queijo, fiambre, delicias e camarão', en: 'Tomato, cheese, ham, crab and prawns', fr: 'Tomate, fromage, jambon, surimi et crevettes', de: 'Tomaten, käse, schinken, krabben und garnelen' }, 
          price: 9.00 
        },
        { 
          id: 'p7', code: '7', 
          name: { pt: 'Sicilia', en: 'Sicilia', fr: 'Sicilia', de: 'Sizilien' }, 
          description: { pt: 'Tomate, queijo, cogumelos e salami', en: 'Tomato, cheese, mushrooms and salami', fr: 'Tomate, fromage, champignons et salami', de: 'Tomaten, käse, pilze und salami' }, 
          price: 9.00 
        },
        { 
          id: 'p8', code: '8', 
          name: { pt: 'Roma', en: 'Roma', fr: 'Roma', de: 'Rom' }, 
          description: { pt: 'Tomate, queijo, atum e camarão', en: 'Tomato, cheese, tunafish and prawns', fr: 'Tomate, fromage, thon et crevettes', de: 'Tomaten, käse, thunfisch und garnelen' }, 
          price: 9.00 
        },
        { 
          id: 'p9', code: '9', 
          name: { pt: 'Quatro estações', en: 'Four seasons', fr: 'Quatre saisons', de: 'Vier jahreszeiten' }, 
          description: { pt: 'Tomate, queijo, fiambre, cogumelos, camarão e mexilhão', en: 'Tomato, cheese, ham, prawns and mussels', fr: 'Tomate, fromage, jambom, champignons, crevettes et moules', de: 'Tomaten, Käse, Schinken, Garnelen und Muscheln' }, 
          price: 10.00 
        },
        { 
          id: 'p13', code: '13', 
          name: { pt: 'Hawaii-havaiana', en: 'Hawaii', fr: 'Hawaï', de: 'Hawaii' }, 
          description: { pt: 'Tomate, queijo, fiambre e ananás', en: 'Tomato, cheese, ham and pine-apple', fr: 'Tomate, fromage, jambon et ananas', de: 'Tomaten, käse, schinken und pinienapfel' }, 
          price: 9.00 
        },
        { 
          id: 'p15', code: '15', 
          name: { pt: 'Americana', en: 'American', fr: 'Américaine', de: 'Amerikanisch' }, 
          description: { pt: 'Tomate, queijo, cogumelos, pepperoni e camarão', en: 'Tomato, cheese, mushrooms, pepperoni and prawns', fr: 'Tomate, fromage, champignons, pepperoni et crevettes', de: 'Tomaten, käse, pilze, peperoni und garnelen' }, 
          price: 10.00 
        },
        { 
          id: 'p16', code: '16', 
          name: { pt: 'Jamaica', en: 'Jamaica', fr: 'Jamaïque', de: 'Jamaika' }, 
          description: { pt: 'Tomate, queijo, fiambre, cogumelos e camarão', en: 'Tomato, cheese, ham, mushrooms e prawns', fr: 'Tomate, fromage, jambon, champignons et crevettes', de: 'Tomaten, käse, schinken, pilze und garnelen' }, 
          price: 10.00 
        },
        { 
          id: 'p18', code: '18', 
          name: { pt: 'Disco', en: 'Disco', fr: 'Disco', de: 'Disco' }, 
          description: { pt: 'Tomate, queijo, fiambre, bolonhesa e camarão', en: 'Tomato, cheese, ham, bolognaise sauce and prawns', fr: 'Tomate, fromage, jambon, sauce bolognaise et crevettes', de: 'Tomaten, käse, schinken, bolognese-sauce und garnelen' }, 
          price: 10.00 
        },
        { 
          id: 'p19', code: '19', 
          name: { pt: 'Vegetariana', en: 'Vegetarian', fr: 'Végétarienne', de: 'Vegetarisch' }, 
          description: { pt: 'Tomate, queijo, cebola, cogumelos, ananás, banana e pimento', en: 'Tomato, cheese, onions, mushrooms, pine-apple, banana and peppers', fr: 'Tomate, fromage, oignon, champignons, ananas, banane e piment vert', de: 'Tomaten, käse, zwiebeln, pilze, pinienapfel, bananen und paprika' }, 
          price: 9.00 
        },
        { 
          id: 'p20', code: '20', 
          name: { pt: 'Margarita', en: 'Margarita', fr: 'Margarita', de: 'Margarita' }, 
          description: { pt: 'Tomate, queijo', en: 'Tomato and cheese', fr: 'Tomate et fromage', de: 'Tomaten und käse' }, 
          price: 8.75 
        },
        { 
          id: 'p23', code: '23', 
          name: { pt: 'Algarvia', en: 'Algarve', fr: 'Algarvia', de: 'Algarvia' }, 
          description: { pt: 'Tomate, queijo, fiambre, cebola e bacon', en: 'Tomato, cheese, ham, onions and bacon', fr: 'Tomate, fromage, jambon, oignons et bacon', de: 'Tomaten, käse, schinken, zwiebeln und speck' }, 
          price: 9.00 
        },
      ]
    },
    {
      id: 'pizzas-especiais',
      title: { pt: 'Pizzas Especiais', en: 'Special Pizzas', fr: 'Pizzas Spéciales', de: 'Spezialpizzen' },
      items: [
        { 
          id: 'pe12', code: '12', 
          name: { pt: 'Fenícia Especial', en: 'Fenicia Special', fr: 'Fenícia Spéciale', de: 'Fenícia Especial' }, 
          description: { pt: 'Tomate, queijo, fiambre,cebola, lombo de porco, camarão e pimentos', en: 'Tomato, cheese, ham, onions, pork fillet, prawns and peppers', fr: 'Tomate, fromage, jambon, oignons, filet de porc, crevettes et piment vert', de: 'Tomaten, käse, schinken, zwiebeln, schweinefilet, garnelen und paprika' }, 
          price: 11.00 
        },
        { 
          id: 'pe22', code: '22', 
          name: { pt: 'Tavira Especial', en: 'Tavira Special', fr: 'Tavira Spéciale', de: 'Tavira Especial' }, 
          description: { pt: 'Tomate, queijo, fiambre, carne kebab e molho', en: 'Tomato, cheese, ham, kebab meat and sauce', fr: 'Tomate, fromage, jambon, viande de kebab et sauce', de: 'Tomaten, käse, schinken, kebab fleisch und soße' }, 
          price: 11.00 
        },
        { 
          id: 'pe24', code: '24', 
          name: { pt: 'Babilon Especial', en: 'Babilon Special', fr: 'Babilon Spéciale', de: 'Babilon Especial' }, 
          description: { pt: 'Tomate, queijo, cogumelos, cebola, carne kebab e molho', en: 'Tomato, cheese, mushrooms, onions, kebab meat and sauce', fr: 'Tomate, fromage, champignons, oignons, viande de kebab et sauce', de: 'Tomaten, käse, pilze, zwiebeln, kebab fleisch und soße' }, 
          price: 11.00 
        },
        { 
          id: 'pe38', code: '38', 
          name: { pt: 'Chicken pizza', en: 'Chicken pizza', fr: 'Pizza au poulet', de: 'Hühnchen pizza' }, 
          description: { pt: 'Tomate, queijo, frango, cogumelos, cebola, pimentos,natas e tomate fresco', en: 'Tomato, cheese, chicken, mushrooms, onions, peppers, cream and fresh tomato', fr: 'Tomate, fromage, poulet, champignons, oignon, piment vert, crème fraîche e tomate fraiche', de: 'Tomaten, käse, hühnchen, pilze, zwiebeln, paprika, sahne und frische tomaten' }, 
          price: 11.00 
        },
        { 
          id: 'pe39', code: '39', 
          name: { pt: 'Pizza Barco', en: 'Boat Pizza', fr: 'Pizza Bateau', de: 'Boot Pizza' }, 
          description: { pt: 'Tomate, queijo, cogumelos, cebola, lombinho de porco, natas e molho', en: 'Tomato, cheese, mushrooms, onions, pork fillet, cream and kebab sauce', fr: 'Tomate, fromage, champignons, oignon, filet de porc, crème fraîche et sauce de kebab', de: 'Tomaten, käse, pilze, zwiebeln, schweinefilet, sahne und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe40', code: '40', 
          name: { pt: 'Portuguesa', en: 'Portuguese', fr: 'Portugaise', de: 'Portugiesisch' }, 
          description: { pt: 'Tomate, queijo, cogumelos, cebola, bacon, anchovas e ovo', en: 'Tomato, cheese, mushrooms, onions, bacon, anchovy and egg', fr: 'Tomate, fromage, champignons, oignons, bacon, anchois et oeuf', de: 'Tomate, käse, pilze, zwiebeln, speck, sardelle und ei' }, 
          price: 11.00 
        },
        { 
          id: 'pe41', code: '41', 
          name: { pt: 'Jack Especial', en: 'Jack Special', fr: 'Jack Spécial', de: 'Jack Especial' }, 
          description: { pt: 'Tomate, queijo, atum, cebola, bacon, pimentos, milho', en: 'Tomato, cheese, tunafish, onions, bacon, peppers, sweet corn', fr: 'Tomate, fromage, thon, oignon, bacon, piment vert et maїs', de: 'Tomaten, käse, thunfisch, zwiebeln, speck, paprika, mais' }, 
          price: 11.00 
        },
        { 
          id: 'pe50', code: '50', 
          name: { pt: 'Black and White', en: 'Black and White', fr: 'Noir et Blanc', de: 'Schwarz und Weiß' }, 
          description: { pt: 'Tomate, queijo, lombinho de porco, carne kebab, cogumelos, tomate fresco, molho bearnesa e molho de kebab', en: 'Tomato, cheese, pork fillet, kebab meat, mushrooms, fresh tomato, bearnesa sauce and kebab sauce', fr: 'Tomate, fromage, filet de porc, viande de kebab, champignons, tomate fraîche, sauce bernaise et sauce de kebab', de: 'Tomaten, käse, schweinefilet, kebab-fleisch, pilze, frische tomaten, sauce béarnaise und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe51', code: '51', 
          name: { pt: 'Jakob Voador', en: 'Jakob Voador', fr: 'Jakob Voador', de: 'Jakob Voador' }, 
          description: { pt: 'Tomate, queijo, frango, cogumelos, amendoins, caril e molho de kebab', en: 'Tomato, cheese, chicken, mushrooms, peanuts, curry and kebab sauce', fr: 'Tomate, fromage, poulet, champignons, cacahuètes, curry et sauce de kebab', de: 'Tomaten, käse, hühnchen, pilze, erdnüsse, curry und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe52', code: '52', 
          name: { pt: 'Marinheiro', en: 'Sailor', fr: 'Marin', de: 'Seemann' }, 
          description: { pt: 'Tomate, queijo, bolonhesa, bacon, ananás, pimentos, camarão e molho de kebab', en: 'Tomato, cheese, bolognaise, bacon, pine-apple, peppers, prawns and kebab sauce', fr: 'Tomate, fromage, bolognaise, bacon, ananas, piment verd, crevettes et sauce de kebab', de: 'Tomaten, käse, bolognese, speck, ananas, paprika, garnelen und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe55', code: '55', 
          name: { pt: 'Frango', en: 'Chicken', fr: 'Poulet', de: 'Hähnchen' }, 
          description: { pt: 'Tomate, queijo, frango, ananás, caril e molho de kebab', en: 'Tomato, cheese, chicken, pine-apple, curry and kebab sauce', fr: 'Tomate, fromage, poulet, ananas, curry et sauce de kebab', de: 'Tomaten, käse, hühnchen, ananas, curry und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe57', code: '57', 
          name: { pt: 'Formula 1', en: 'Formula 1', fr: 'Formule 1', de: 'Formel 1' }, 
          description: { pt: 'Tomate, queijo, fiambre, carne kebab, bacon, cebola, tomate fresco e molho de kebab', en: 'Tomato, cheese, ham, kebab meat, bacon, onions, fresh tomato and kebab sauce', fr: 'Tomate, fromage, jambon, viande de kebab, oignon, tomate fraîche e sauce de kebab', de: 'Tomaten, käse, schinken, kebab-fleisch, speck, zwiebeln, frische tomaten und kebab-sauce' }, 
          price: 11.00 
        },
        { 
          id: 'pe58', code: '58', 
          name: { pt: 'Tropical (empada)', en: 'Tropical (pie)', fr: 'Tropical (tourte)', de: 'Tropisch (Pastete)' }, 
          description: { pt: 'Queijo, banana, ananás, maça, canela, natas e açucar', en: 'Cheese, banana, pine-apple, apple cinnamon, cream and sugar', fr: 'Fromage, banana, ananas, pomme, cannelle, crème fraîche et sucre', de: 'Käse, banane, pinienapfel, apfel zimt, sahne und zucker' }, 
          price: 10.00 
        },
        { 
          id: 'pe59', code: '59', 
          name: { pt: 'Cheese Pizza', en: 'Cheese Pizza', fr: 'Pizza au Fromage', de: 'Käsepizza' }, 
          description: { pt: '4- diferentes queijos', en: '4- different cheese', fr: '4-assortiment de 4 fromages', de: '4 verschiedene käse' }, 
          price: 10.00 
        },
      ]
    }
  ]
};
