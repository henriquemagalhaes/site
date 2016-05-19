module.exports = {

	brand: 'Mensário Fiscal',
    domain: 'admin',
    session: { 
        secret: 'ElGranPolloLocoxEFRetcGRerPKnuim' 
    },
    admin: { 
    	_id: 'admin-1', 
    	usr: 'admin', 
    	pwd: 'admin', 
    	name:'Administrador', 
    	email: 'beto_andr@hotmail.com', 
    	role: 'admin'
    },
	db: {
        usr: 'menfis',
        pwd: 'VinnieColaiuta',
        srv: 'ds041218.mongolab.com:41218',
        db:  'mensario',
        par: 'auto_reconnect',
        connectionString: 'mongodb://menfis:VinnieColaiuta@ds041034-a0.mongolab.com:41034/mensario_2_6_11?replicaSet=rs-ds041034'
    },
    s3: {
        awsKey: 'AKIAIIF37NJW7HCRAUQQ',
        aws__SECRET__key: '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',
        bucket: 'mensario',
        bucketURL: 'https://mensario.s3.amazonaws.com',
        accessType: 'public-read',
        callback: 'http://ottersys.com.br/s3/callback',
        fileURL: 'https://s3-sa-east-1.amazonaws.com/mensario/files/'
    }

}