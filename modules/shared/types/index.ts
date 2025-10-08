export type Optional<T> = T | null | undefined;

export const checklistCategories = [
  { key: "frein", title: "Frein" },
  { key: "cable_levage", title: "Câble de levage" },
  { key: "chaine_levage", title: "Chaîne de levage" },
  { key: "guide_cable", title: "Guide-câble" },
  { key: "guide_chaine", title: "Guide-chaîne" },
  { key: "panier_chaine", title: "Panier à chaîne" },
  { key: "crochet_levage", title: "Crochet de levage" },
  { key: "crochet_suspension", title: "Crochet/Suspension" },
  { key: "linguets", title: "Linguets" },
  { key: "moufle_inferieur", title: "Moufle inférieur" },
  { key: "moufle_superieur", title: "Moufle supérieur" },
  { key: "fin_course", title: "Fin de course" },
  { key: "bruit_reducteur", title: "Bruit réducteur" },
  { key: "joint_etancheite", title: "Joint d'étanchéité" },
  { key: "lub_reducteur", title: "Lub/Réducteur" },
  { key: "pignon_attaque", title: "Pignon d'attaque" },
  { key: "acc_transmission", title: "Acc/Transmission" },
  { key: "arbre_transmission", title: "Arbre transmission" },
  { key: "roues_menantes", title: "Roues menantes" },
  { key: "roues_menees", title: "Roues menées" },
  { key: "galet_guide", title: "Galet guide" },
  { key: "pare_choc", title: "Pare-choc" },
  { key: "butoir", title: "Butoir" },
  { key: "bati", title: "Bâti" },
  { key: "anti_chute", title: "Anti-chute" },
  { key: "chemin_roulement", title: "Chemin de roulement" },
  { key: "poutre_maitresse", title: "Poutre-maîtresse" },
  { key: "etiquette_capacite", title: "Étiquette de capacité" },
  { key: "disjoncteur_principal", title: "Disjoncteur principal" },
  { key: "panneau_alimentation", title: "Panneau alimentation" },
  { key: "demarreur_inverseur", title: "Démarreur-inverseur" },
  { key: "contacteur_pric_mc", title: "Contacteur pric. (M.C.)" },
  { key: "cable_alimentation", title: "Câble d'alimentation" },
  { key: "cable_feston_stat_pen", title: "Câble feston stat/pen" },
  { key: "cable_sq_stat_pen", title: "Câble s/o de stat/pen" },
  { key: "boite_jonction_stat_pen", title: "Boîte jonction stat/pen" },
  { key: "barre_conductrice", title: "Barre conductrice" },
  { key: "collecteur_brosse", title: "Collecteur et brosse" },
  { key: "klaxon", title: "Klaxon" },
  { key: "boutier_stat_pen", title: "Boîtier de stat/pen" },
  { key: "poussoir_stat_pen", title: "Poussoir stat/pen" },
  { key: "etiquette_stat_pen", title: "Étiquette stat/pen" },
  { key: "bouton_arret_urgence", title: "Bouton arrêt urgence" },
  { key: "variateur_vitesse", title: "Variateur de vitesse" },
  { key: "limiteur_charge", title: "Limiteur de charge" },
  { key: "charniere", title: "Charnière" },
  { key: "identification", title: "Identification" },
];

export function getChecklistIdxByKey(
  key: string,
  customItems: Array<{ key: string; title: string }> = [],
) {
  // First check in default categories
  const defaultIndex = checklistCategories.findIndex((c) => c.key === key);
  if (defaultIndex !== -1) {
    return defaultIndex;
  }

  // If not found in defaults, check in custom items and add offset
  const customIndex = customItems.findIndex((c) => c.key === key);
  if (customIndex !== -1) {
    return checklistCategories.length + customIndex;
  }

  // If not found anywhere, return 0 as fallback
  return 0;
}

export const equipmentTypes = [
  { value: "pont_roulant", label: "Pont Roulant" },
  { value: "pont_roulant_double_palan", label: "Pont Roulant Double Palan" },
  { value: "monorail", label: "Monorail" },
  { value: "gantry", label: "Gantry" },
  { value: "semigantry", label: "Semigantry" },
  { value: "potence", label: "Potence" },
  { value: "palan_electrique", label: "Palan Électrique" },
  { value: "palan_manuel", label: "Palan Manuel" },
];

export const hoistTypes = [
  { value: "palan_electrique", label: "Palan Électrique" },
  { value: "palan_manuel", label: "Palan Manuel" },
  { value: "palan_chain", label: "Palan à Chaîne" },
  { value: "palan_cable", label: "Palan à Câble" },
  { value: "palan_verin", label: "Palan à Vérin" },
  { value: "palan_cremaillere", label: "Palan à Crémaillère" },
  { value: "palan_roue_et_vis", label: "Palan à Roue et Vis" },
  {
    value: "palan_roue_et_vis_sans_fin",
    label: "Palan à Roue et Vis sans Fin",
  },
  {
    value: "palan_roue_et_vis_sans_fin_avec_vis_sans_fin",
    label: "Palan à Roue et Vis sans Fin avec Vis sans Fin",
  },
  {
    value: "palan_roue_et_vis_sans_fin_avec_vis_sans_fin_et_vis_sans_fin",
    label: "Palan à Roue et Vis sans Fin avec Vis sans Fin et Vis sans Fin",
  },
];

export const trolleyTypes = [
  { value: "chariot_manuel", label: "Chariot Manuel" },
  { value: "chariot_electrique", label: "Chariot Électrique" },
  { value: "chariot_roue_et_vis", label: "Chariot à Roue et Vis" },
  {
    value: "chariot_roue_et_vis_sans_fin",
    label: "Chariot à Roue et Vis sans Fin",
  },
  {
    value: "chariot_roue_et_vis_sans_fin_avec_vis_sans_fin",
    label: "Chariot à Roue et Vis sans Fin avec Vis sans Fin",
  },
  {
    value: "chariot_roue_et_vis_sans_fin_avec_vis_sans_fin_et_vis_sans_fin",
    label: "Chariot à Roue et Vis sans Fin avec Vis sans Fin et Vis sans Fin",
  },
];

export const statusLabels = [
  { value: "draft", label: "Brouillon" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "checked_ok", label: "Conforme" },
  { value: "issue", label: "Anomalie" },
  { value: "unchecked", label: "Non vérifié" },
];

export const problemTypes = [
  { value: "safety", label: "Sécurité", priority: "critical" },
  { value: "sécurité", label: "Sécurité", priority: "critical" },
  { value: "structural", label: "Structurel", priority: "high" },
  { value: "structurel", label: "Structurel", priority: "high" },
  { value: "electrical", label: "Électrique", priority: "high" },
  { value: "électrique", label: "Électrique", priority: "high" },
  { value: "mechanical", label: "Mécanique", priority: "medium" },
  { value: "mécanique", label: "Mécanique", priority: "medium" },
  { value: "cosmetic", label: "Cosmétique", priority: "low" },
  { value: "cosmétique", label: "Cosmétique", priority: "low" },
  { value: "maintenance", label: "Entretien", priority: "medium" },
  { value: "entretien", label: "Entretien", priority: "medium" },
];

// Helper functions for type mappings
export function getChecklistCategoryTitle(key: string): string {
  const category = checklistCategories.find((c) => c.key === key);
  return category ? category.title : key;
}

export function getStatusLabel(status: string): string {
  const statusLabel = statusLabels.find((s) => s.value === status);
  return statusLabel ? statusLabel.label : status;
}

export function getProblemTypeLabel(problemType: string): string {
  const problem = problemTypes.find((p) => p.value === problemType);
  return problem ? problem.label : problemType;
}

export function getProblemTypePriority(
  problemType: string,
): "low" | "medium" | "high" | "critical" {
  const problem = problemTypes.find((p) => p.value === problemType);
  return (
    (problem?.priority as "low" | "medium" | "high" | "critical") || "medium"
  );
}

export const getEquipmentTypeLabel = (equipmentType: string): string => {
  const labels: Record<string, string> = {
    pont_roulant: "Pont roulant",
    pont_roulant_simple_palan: "Pont roulant simple palan",
    pont_roulant_double_palan: "Pont roulant double palan",
    pont_roulant_triple_palan: "Pont roulant triple palan",
    monorail: "Monorail",
    monorail_simple: "Monorail simple",
    monorail_double: "Monorail double",
    potence: "Potence",
    potence_simple: "Potence simple",
    potence_double: "Potence double",
    grue_mobile: "Grue mobile",
    grue_fixe: "Grue fixe",
    palan_electrique: "Palan électrique",
    palan_manuel: "Palan manuel",
    treuil: "Treuil",
    autre: "Autre",
  };

  // If not found in mapping, convert underscores to spaces and capitalize first letter of each word
  if (!labels[equipmentType]) {
    return equipmentType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return labels[equipmentType];
};
