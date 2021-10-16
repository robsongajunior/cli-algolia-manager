# cli-algolia-manager

<p align="center">
<img src="./doc/img/cover-01.png" alt="Cover Image" title="Cover Image"/>
</br>
The CLI to help to facilitate add/delete/reindex management data from Algolia indexes.
</p>


## Easy to use

``` bash
npm install .
node index.js index=[name] lang=[lang]
```

> ATENTION: config file required to perform command.


The config file should be: `~/.algolia/conf.json`.

``` json
{
	"key": {
		"app": "OSJ19HQ1NZ", // just an example
		"api": "ebmmf0za524aoiucjek188mmapp130ad" // just an example
	},
	"lang": ["en", "ptbr"],
	"blog": {
		"en": {
			"name": "blog-rgajr-en",
			"filepath": "/Users/robson.junior/development/rgajr-blog/_site/en/algolia/data/blog.json"
		},
		"ptbr": {
			"name": "blog-rgajr-ptbr",
			"filepath": "/Users/robson.junior/development/rgajr-blog/_site/pt-br/algolia/data/blog.json"
		}
	}
}
```

|  ATTRIBUTE  |  TYPE  |                              DESCRIPTION                            |
|-------------|--------|---------------------------------------------------------------------|
|    key      | Object | Contains the identify attributes for access the app and use the api |
|   key.app   | String | Algolia APP id                                                      |
|   key.api   | String | Algolia API key                                                     |
|     lang    |  List  | The lang enabled to be used into index validation                   |
|    [blog]   | Object | Can be N objects, The name is optional, used into index param, like index=blog        |
|   blog.en   | Object | Can be many languages, Contains the object with the name of Algolia index and the filepath data to be publish |
| blog.en.name | String | The name of Algolia index |
| blog.en.filepath | String | The file path with data to be uploaded |

## Parameters

|  PARAMETER  |               OPTIONS                  |               DESCRIPTION             |
|-------------|----------------------------------------|---------------------------------------|
|   index     |                 ---                    | The object into index json configuration |
|    lang     |                 ---                    | The the lang of index json configuration |

## Features

|  FEATURE |                COMMAND                 |               DESCRIPTION             |
|----------|----------------------------------------|---------------------------------------|
|  reindex | node index.js index=[name] lang=[lang] | This command clean the index and reupload again |

