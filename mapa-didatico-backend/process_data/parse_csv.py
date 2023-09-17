import glob, json

def get_metadata(header: list[str]):
    """
    return metada file and header csv
    """
    return header[0 : 7] , header[-1]

def format_metada(metada: list[str]):
    metadata = {}
    for i in metada:
        metadata[i.split(';')[0]] = i.split(';')[1].replace('\n', '')
    return metadata

def format_header(header: str):
    header = header.split(';')
    header[-1] = header[-1].replace('\n', '')
    return header

def format_lines(line: str):
    line = line.split(';')
    line[-1] = line[-1].replace('\n', '')
    return line 

def convert_hours(hora_utc):
    hora = hora_utc[:2]
    minutos = hora_utc[2:4]
    return f"{hora}:{minutos}"

def replaceFloat(numero):
    new = numero.replace(',', '.')
    if new.strip() == '':
        return 0.0  
    else:
        return float(new)

def process_data(fileName):
    json_data = {}
    with open(name_csv, 'r') as csvfile:
        header = []
        for i in range(0, 9):
            header.append(csvfile.readline())
        
        metadatas_with_header = get_metadata(header)
        json_data['metadata'] = format_metada(metadatas_with_header[0])# get metadatas in f0 positio

        # ler linhas a partir da linha 10, até o final do arquivo
        json_data['data'] = []
        lines = csvfile.readlines()[9:]
        for line in lines:
            line = format_lines(line)
            json_day = {}
            temp = float(replaceFloat(line[7]))
            if(temp == 0.0): continue
            json_day['data'] = line[0]
            json_day['hora'] = convert_hours(line[1])
            json_day['temp_maxi_h'] = temp
            json_data['data'].append(json_day)
    return  json_data


global_json_data = []
#in directory 2022 get all file .csv
for name_csv in glob.glob('2022/*.csv'):
    # process data
    json_data = process_data(name_csv)
    global_json_data.append(json_data)

# save data in json file
with open('data.json', 'w') as jsonfile:
    json.dump(global_json_data, jsonfile, indent=4)




        