
exports.up = function(knex) {
    return knex.schema.createTable('ubs', function(t) {
        t.increments('id').unsigned().primary();
        t.string('CNES');
        t.string('UF');
        t.string('IBGE');
        t.string('NOME');
        t.string('LOGRADOURO');
        t.string('BAIRRO')
        t.string('LATITUDE')
        t.string('LONGITUDE')
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('ubs');
};
