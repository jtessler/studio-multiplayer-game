function createNewPlayer(playerId) {
  return {
    playerId: playerId,
    guessedWords: [],
    points: 0,
    roundWon: false
  };
}

function createNewPlayerList(playerIdList) {
  let playerList = [];
  playerIdList.forEach(id => {
    playerList.push(createNewPlayer(id));
  });
  return playerList;
}

function guessWord(word, correctWord, playerObj) {
  console.log(word + " " + correctWord);
  if (playerObj.guessedWords) {
    playerObj.guessedWords.push(word);
  } else {
    playerObj.guessedWords = [word];
  }

  if (word === correctWord) {
    playerObj.points += 1;
    playerObj.roundWon = true;
  }
  return playerObj;
}

function isDone(playerObj) {
  return (
    playerObj.roundWon ||
    (playerObj.guessedWords && playerObj.guessedWords.length > 3)
  );
}

function restartRound(playerList) {
  playerList.forEach(player => {
    player.guessedWords = [];
    player.roundWon = false;
  });
  return playerList;
}

function getPlayer(playerId, playerList) {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].playerId === playerId) {
      return playerList[i];
    }
  }
}

function allPlayersDone(playerList) {
  let playersDone = true;
  playerList.forEach(player => {
    if (!isDone(player)) {
      playersDone = false;
      return false;
    }
  });
  return playersDone;
}

function reconcilePlayerList(firebasePlayers, localPlayers) {
  let playerIds = new Set();
  for (let i = 0; i < firebasePlayers.length; i++) {
    playerIds.add(firebasePlayers[i].playerId);
  }

  for (let i = 0; i < localPlayers.length; i++) {
    playerIds.add(localPlayers[i].playerId);
  }

  let combinedPlayerList = [];
  playerIds.forEach(id => {
    let maybeFBPlayer = getPlayer(id, firebasePlayers);
    let maybeLocalPlayer = getPlayer(id, localPlayers);
    if (maybeFBPlayer) {
      combinedPlayerList.push(maybeFBPlayer);
    } else {
      combinedPlayerList.push(maybeLocalPlayer);
    }
  });

  return combinedPlayerList;
}

const wordList = [
  "aardvark",
  "albatross",
  "alligator",
  "alpaca",
  "ant",
  "anteater",
  "antelope",
  "ape",
  "armadillo",
  "baboon",
  "badger",
  "barracuda",
  "bat",
  "bear",
  "beaver",
  "bee",
  "bison",
  "boar",
  "buffalo",
  "butterfly",
  "camel",
  "capybara",
  "caribou",
  "cassowary",
  "cat",
  "caterpillar",
  "cattle",
  "chamois",
  "cheetah",
  "chicken",
  "chimpanzee",
  "chinchilla",
  "chough",
  "clam",
  "cobra",
  "cockroach",
  "cod",
  "cormorant",
  "coyote",
  "crab",
  "crane",
  "crocodile",
  "crow",
  "curlew",
  "deer",
  "dinosaur",
  "dog",
  "dogfish",
  "dolphin",
  "donkey",
  "dotterel",
  "dove",
  "dragonfly",
  "duck",
  "dugong",
  "dunlin",
  "eagle",
  "echidna",
  "eel",
  "eland",
  "elephant",
  "elephant-seal",
  "elk",
  "emu",
  "falcon",
  "ferret",
  "finch",
  "fish",
  "flamingo",
  "fly",
  "fox",
  "frog",
  "gaur",
  "gazelle",
  "gerbil",
  "giant-panda",
  "giraffe",
  "gnat",
  "gnu",
  "goat",
  "goose",
  "goldfinch",
  "goldfish",
  "gorilla",
  "goshawk",
  "grasshopper",
  "grouse",
  "guanaco",
  "guinea-fowl",
  "guinea-pig",
  "gull",
  "hamster",
  "hare",
  "hawk",
  "hedgehog",
  "heron",
  "herring",
  "hippopotamus",
  "hornet",
  "horse",
  "human",
  "hummingbird",
  "hyena",
  "ibex",
  "ibis",
  "jackal",
  "jaguar",
  "jay",
  "jellyfish",
  "kangaroo",
  "kingfisher",
  "koala",
  "komodo-dragon",
  "kookabura",
  "kouprey",
  "kudu",
  "lapwing",
  "lark",
  "lemur",
  "leopard",
  "lion",
  "llama",
  "lobster",
  "locust",
  "loris",
  "louse",
  "lyrebird",
  "magpie",
  "mallard",
  "manatee",
  "mandrill",
  "mantis",
  "marten",
  "meerkat",
  "mink",
  "mole",
  "mongoose",
  "monkey",
  "moose",
  "mouse",
  "mosquito",
  "mule",
  "narwhal",
  "newt",
  "nightingale",
  "octopus",
  "okapi",
  "opossum",
  "oryx",
  "ostrich",
  "otter",
  "owl",
  "ox",
  "oyster",
  "panther",
  "parrot",
  "partridge",
  "peafowl",
  "pelican",
  "penguin",
  "pheasant",
  "pig",
  "pigeon",
  "polar-bear",
  "pony",
  "porcupine",
  "porpoise",
  "prairie-dog",
  "quail",
  "quelea",
  "quetzal",
  "rabbit",
  "raccoon",
  "rail",
  "ram",
  "rat",
  "raven",
  "red-deer",
  "red-panda",
  "reindeer",
  "rhinoceros",
  "rook",
  "salamander",
  "salmon",
  "sand-dollar",
  "sandpiper",
  "sardine",
  "scorpion",
  "sea-lion",
  "sea-urchin",
  "seahorse",
  "seal",
  "shark",
  "sheep",
  "shrew",
  "skunk",
  "snail",
  "snake",
  "sparrow",
  "spider",
  "spoonbill",
  "squid",
  "squirrel",
  "starling",
  "stingray",
  "stinkbug",
  "stork",
  "swallow",
  "swan",
  "tapir",
  "tarsier",
  "termite",
  "tiger",
  "toad",
  "trout",
  "turkey",
  "turtle",
  "vicuña",
  "viper",
  "vulture",
  "wallaby",
  "walrus",
  "wasp",
  "water-buffalo",
  "weasel",
  "whale",
  "wolf",
  "wolverine",
  "wombat",
  "woodcock",
  "woodpecker",
  "worm",
  "wren",
  "yak",
  "zebra"
];
export {
  createNewPlayer,
  createNewPlayerList,
  isDone,
  guessWord,
  restartRound,
  getPlayer,
  allPlayersDone,
  wordList,
  reconcilePlayerList
};
