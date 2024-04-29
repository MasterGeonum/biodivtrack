# à marquer dans le terminal : python apiplante.py OU py apiplante.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from psycopg2 import connect
from shapely.wkb import loads as load_wkb

app = Flask(__name__)
# CORS(app) 

# route pour obtenir le fichier complet des villes : OK
@app.route('/geojson')
def geojson():
    with connect("service=local_biodiv") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(study_area.*)::json)
            ) as geojson
            from sandbox.study_area
            """)
        return jsonify(cur.fetchone()[0])

#####VILLES
# route pour avoir la liste des villes (avec plus de 50 points car on ne va pas faire des statistiques sur
# des villes avec peu d'occurence)
@app.route('/listeville')
def geojson_liste_ville():
    with connect("service=local_biodiv") as con:
        cur = con.cursor()
        cur.execute("""
            SELECT plante."UrbanAggl"
            FROM sandbox.plante
            WHERE plante."UrbanAggl" IS NOT NULL
            GROUP BY plante."UrbanAggl"
            HAVING COUNT(id) > 50; 
            """) #vous pouvez ici remplacer la requête entre """" par SELECT DISTINCT "UrbanAggl" from sandbox.plante pour avoir toutes les villes
        return jsonify(cur.fetchall())


######ESPECES
# route pour avoir la liste des espèces
@app.route('/listeSpecie')
def geojson_liste_specie():
    with connect("service=local_biodiv") as con:
        cur = con.cursor()
        cur.execute("""
SELECT DISTINCT species from sandbox.plante
            """)
        return jsonify(cur.fetchall())


#Route pour interroger le serveur, connecté à la BD, qui renvoie un GeoJson d'une ville,
#d'une espèce ou d'une ville+espèce : OK
@app.route('/requetedouble', methods=['POST'])
def requetedouble():
    # print("deb fonction")
    if request.method == 'POST':
        # print("dans if post")

        # Obtenir les valeurs sélectionnées des deux select
        ville = request.form.get('searchInput')  #Ici les SearchInput correspondent à l'ID de ce qui est sléctionné dans l'appli (voir HTML)
        print(request.form)
        espece = request.form.get('searchInputSpecies')
        print(f"espece : {espece}")

        # Définir les clauses WHERE vides initialement
        clause1 = ""
        clause2 = ""

        # Construire les clauses WHERE en fonction des valeurs sélectionnées
        if ville:
            clause1 = f"\"UrbanAggl\" ='{ville}'"
        if espece:
            clause2 = f"species = '{espece}'"

        # Assembler les clauses WHERE avec un AND
        where_clause = ""
        if clause1 and clause2:
            where_clause = f"WHERE {clause1} AND {clause2}"
        elif clause1 or clause2:
            where_clause = f"WHERE {clause1 if clause1 else clause2}"

        # where_clause = "WHERE species LIKE \'Aa colom%\'"
        # print(f"where clause : {where_clause}")


        # Construire la requête SQL complète
        sql_query = f"""
            SELECT plante.*
            FROM sandbox.plante 
            {where_clause};
            """
        print(sql_query) #voir la structure de la requête 

        # Exécuter la requête SQL
        with connect("service=local_biodiv") as con:
            cur = con.cursor()
            cur.execute(sql_query)
        # Construire le geojson
        plantes = cur.fetchall()
        results = []

        for plante in plantes:
            geometry = load_wkb(plante[1])  # Convertir la géométrie WKT en objet Shapely
            coordinates = [geometry.x, geometry.y]  # Extraire les coordonnées x et y du point

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": {
                    "id": plante[0],
                    "geom": plante[1],
                    "phylum": plante[5],
                    "class": plante[6],
                    "order": plante[7],
                    "family": plante[8],
                    "genus": plante[9],
                    "species": plante[10],
                    "scientificName": plante[11],
                    "statut": plante[19],
                    "iucn": plante[20],
                    "lien": plante[21],
                    "pays": plante[22],
                    "ville": plante[23],
                    "parc": plante[25],
                    "distfleuve": plante[27],
                    "nbespece": plante[28],
                    "topespece": plante[29],
                    "especerare": plante[30],
                    "statutparc": plante[31]
                }
            }
            results.append(feature)

        # Convertir la liste de dictionnaires en GeoJSON
        geojson = {
            "type": "FeatureCollection",
            "features": results
        }
        return jsonify(results)
        
        # print(f"nb rows : {len(rows)}")
    
@app.route('/<path:path>')
def send_report(path):
    return send_from_directory('static', path)

app.run(host='0.0.0.0', port='5000', debug=False)
