#!/usr/bin/node


const fs = require('fs');
const args = require('args-parser')(process.argv);
const homedir = require('os').homedir();
const cwd = process.cwd();
const path = require('path');

let client;
const algoliasearch = require("algoliasearch");
const StreamArray = require('stream-json/streamers/StreamArray');


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
        const configFilePath = path.normalize(`${homedir}/\.algolia/conf.json`);
        
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
    console.log('[*] Starting')
    
    return;

    loadConfig().then((config) => {
        console.log(config);
        client = algoliasearch(config.key.app, config.key.api);
        index = client.initIndex(/* indexname */);
    
        // uploadBatches(config.index[args.index][], args.lang);
    }).catch((error) => {
        throw error;
    });
    
    // uploadBatches(cindex.site, 'en');
} catch(err) {
    console.log(err);
}


