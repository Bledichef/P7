var Sequelize = require("sequelize");
var sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "SQLite",
  logging: false, //passer a true pour voir les différentes requêtes effectuées par l'ORM
});
//on exporte pour utiliser notre connexion depuis les autre fichiers.
var exports = (module.exports = {});
exports.sequelize = sequelize;

const Role = sequelize.define(
  "role",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(255), allowNull: false },
  },
  { tableName: "role", timestamps: false, underscored: true } //par default "tableName" serait "roles" (au pluriel), "timestamps" crée 2 champs automatique pour les dates de création et de modification (très pratique si nécessaire) et "underscored" permet de créer automatiquement des champs de "relation" entre les tables de type "role_id" plutôt que "UserId".
);
exports.Role = Role;

/*
 * USER
 */
const User = sequelize.define(
  "user",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(255), allowNull: false },
    email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
  },
  { tableName: "user", timestamps: false, underscored: true }
);
exports.User = User;

User.belongsTo(Role); //l'utilisateur à un rôle.

sequelize.sync({ logging: console.log });

//on importe le modèle
var Model = require("./Model");
//recherche de tous les utilisateurs
Model.User.findAll()
  .then((users) => {
    //on récupère ici un tableau "users" contenant une liste d'utilisateurs
    console.log(users);
  })
  .catch(function (e) {
    //gestion erreur
    console.log(e);
  });

Model.User.findAll({
  where: { role_id: 2 }, //on veux uniquement ceux qui ont le role "2"
  order: [["name", "ASC"]], //classer par ordre alphabétique sur le nom
}).then((users) => {
  //traitement terminé...
});

//requête d'un utilisateur par son identifiant avec inclusion de la relation "Role"
let id = 19; //id
Model.User.findById(id, {
  include: [{ model: Model.Role }],
}).then((user) => {
  //on peux directement afficher le nom du rôle de l'utilisateur
  console.log(user.role.name);
});

//exemple de création d'un utilisateur, puis de sa suppression dans la foulée. Ce qui permet de voir comment effectuer des requêtes successives.
Model.User.create({
  name: "Test",
  email: "test@testmail.com",
})
  .then((user) => {
    return user.destroy();
  })
  .then((destroy) => {
    //traitement terminé...
  })
  .catch(function (e) {
    //gestion erreur
  });

//exemple de requête d'update d'un utilisateur
let id = 19; //id
Model.User.update({ name: "Numa" }, { where: { id: id } }).then((user) => {
  //traitement terminé...
});

Role.hasMany(User);

//recuperations des utilisateurs correspondants au différents rôles
Model.Role.findAll({ include: [{ model: Model.User }] }).then((roles) => {
  //pour chaque role on peux parcourir la liste des ses utilisateurs
  roles.forEach((role) => {
    console.log(role.name);
    role.users.forEach((user) => {
      console.log(user.name);
    });
  });
  //...
});

User.hasMany(User, { foreignKey: "manager_id", as: "Operators" }); //l'utilisateur peux avoir des "Operators"
User.belongsTo(User, { foreignKey: "manager_id", as: "Manager" }); //l'utilisateur peux avoir un "Manager"

Model.User.findAll({
  include: [
    //j'inclus les roles de mon utilisateur
    { model: Model.Role },
    //mais aussi la liste de ses "Operators" qui ont comme valeur role_id ="1" je récupére également leur propre role.
    {
      model: Model.User,
      as: "Operators",
      where: { role_id: "149999900000000002" },
      include: [{ model: Model.Role }],
    },
  ],
}).then((users) => {
  users.forEach((user) => {
    console.log("----");
    console.log(user.name + " : " + user.role.name);
    console.log("----");
    user.Operators.forEach((operator) => {
      console.log(operator.name + " : " + operator.role.name);
    });
  });
});
