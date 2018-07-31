var Schema = {};

Schema.createSchema = function(mongoose){
    
    //스키마 정의
    var CoffeeShopSchema = mongoose.Schema({
        name:{type:String, index: 'hashed', 'default' :''},
        address : {type:String, 'default' : ''},
        tel : {type: String, 'default' : '' },
        geometry : {
            'type' : {type : String, 'default' : 'Point'},
            coordinates : [{type : 'Number'}]
        },
        created_at : {type : Date, index : {unique : false}, 'default' : Date.now},
        updated_at : {type : Date, index : {unique : false}, 'default' : Date.now}
    });
    
    CoffeeShopSchema.index({geometry : '2dsphere'});
    
    CoffeeShopSchema.static('findAll',function(callback){
        return this.find({},callback); 
    });
    
    CoffeeShopSchema.static('findNear',function(longitude,latitude,maxDistance,callback){
        console.log('CoffeeShopSchema의 findNear 호출됨');
        
        this.find().where('geometry').near(
        {center : {type : 'Point',
                  coordinates : [parseFloat(longitude),parseFloat(latitude)]
                  },
        maxDistance : maxDistance
        }).limit(1).exec(callback);
    });
    
    CoffeeShopSchema.static('findWithin',function(topleft_longitude,topleft_latitude,bottomright_longitude,bottomright_latitude,callback){
        console.log('CoffeeShopSchema의 findWithin 호출됨.');
        
        this.find().where('geometry').within(
        {box:[[parseFloat(topleft_longitude), parseFloat(topleft_latitude)],
             [parseFloat(bottomright_longitude), parseFloat(bottomright_latitude)]]
        }).exec(callback);
    });
    
    
    CoffeeShopSchema.static('findCircle',function(center_longitude, center_latitude, radius, callback){
        console.log('CoffeeShopSchema의 findCircle 호출됨.');
        
        //change radian : 1/6371 -> 1km
        this.find().where('geometry').within(
        {
            center : [parseFloat(center_longitude), parseFloat(center_latitude)],
            radius : parseFloat(radius/6371000),
            unique : true, spherical : true
        }).exec(callback);
    });
    
    //
    return CoffeeShopSchema;
}

module.exports = Schema;