#!/usr/bin/node

let client;
const fs = require('fs');
const args = require('args-parser')(process.argv);
const homedir = require('os').homedir();
const path = require('path');
const algoliasearch = require("algoliasearch");
const StreamArray = require('stream-json/streamers/StreamArray');
const configFilePath = path.normalize(`${homedir}/\.algolia/conf.json`);

function uploadBatches(index, filepath) {
    // let filepath; // fix this line
    // let index = objindex[lang.replace('-', '')] || null;
    
    fs.stat(filepath, (error, stats) => {
        if(!stats.isFile()) {
            console.log(`[!] ${filepath} it is not a file or not exist.`);
            return;
        }
        
        if(!index) {
            throw '[!] An Algolia Index should be configured.';
        }
        
        let chunkLength = 0;
        let chunkList = [];
        let stream = fs.createReadStream(filepath).pipe(StreamArray.withParser());
        
        index.clearObjects().then(() => {
            saveconfig = { autoGenerateObjectIDIfNotExist: true };
            stream.on('data', ({value}) => {
                chunkLength++;
                chunkList.push(value);
                
                if(chunkList.length === 10000) {
                    stream.pause();
                    
                    index.saveObjects(chunkList, saveconfig).then(() => {
                        chunkList = [];
                        stream.resume();
                    }).catch(function(error) {
                        throw error;
                    });
                }
            }).on('end', () => {
                if (!chunkList.length) {
                    return;
                }
                
                index.saveObjects(chunkList, saveconfig).then(() => {
                    chunkList = [];
                }).catch(function(error) {
                    throw error;
                });
            }).on('error', (err) => {
                throw error;
            });
        }).catch(function(error) {
            throw error;
        });
    });
};

function loadConfig() {
    return new Promise((resolve, reject) => {
        fs.stat(configFilePath, (error, stats) => {
            if(error) {
                reject(error);
                return;
            }

            fs.readFile(configFilePath, 'utf-8', (err, filedata) => {
                resolve(JSON.parse(filedata));
            });
        });
    });
};

function hasArgs() {
    return Object.keys(args).length;
};


try {
    if(!hasArgs()) {
        throw '[!] index and lang required params';
    }
    
    if(!args.index) {
         throw '[!] index required param';
    }
    
    if(!args.lang) {
         throw '[!] lang required param';
    }

    loadConfig().then((config) => {
        if(!config) {
            config = {};
        }

        if(!config.key || !config.key.app || !config.key.api) {
            throw `[!] config.key.app and config.key.api required configuration. Please, verify ${configFilePath}`
        }
        

        client = algoliasearch(config.key.app, config.key.api);
        let configItem = config.index[args.index][args.lang];
        let index = client.initIndex(configItem.name);
        let uploadFilePath = configItem.filepath;

        uploadBatches(index, uploadFilePath);
    }).catch((error) => {
        throw error;
    });
} catch(err) {
    console.log(err);
}
