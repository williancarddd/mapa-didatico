import glob
import json
import os


def get_metadata(header):
    """
    Retorna os metadados do arquivo e o cabeçalho do CSV.
    """
    return header[0:7], header[-1]


def format_metadata(metadata):
    metadata_dict = {}
    for item in metadata:
        key, value = item.split(";")
        metadata_dict[key] = value.strip()
    return metadata_dict


def format_header(header):
    header_list = header.split(";")
    header_list[-1] = header_list[-1].strip()
    return header_list


def format_line(line):
    line_list = line.split(";")
    line_list[-1] = line_list[-1].strip()
    return line_list


def convert_hours(hora_utc):
    hora = hora_utc[:2]
    minutos = hora_utc[2:4]
    return f"{hora}:{minutos}"


def replace_float(numero):
    new = numero.replace(",", ".")
    if new.strip() == "":
        return 0.0
    else:
        return float(new)


def process_data(csv_file):
    json_data = {}
    with open(csv_file, "r", encoding='latin-1') as csvfile:
        header = []
        for _ in range(0, 9):
            header.append(csvfile.readline())

        metadata_with_header = get_metadata(header)
        json_data["metadata"] = format_metadata(metadata_with_header[0])

        json_data["data"] = []
        lines = csvfile.readlines()[9:]
        for line in lines:
            line = format_line(line)
            temp = float(replace_float(line[7]))
            if temp == 0.0:
                continue
            json_day = {
                "data": line[0],
                "hora": convert_hours(line[1]),
                "temp_maxi_h": temp,
                "CODIGO (WMO):": json_data["metadata"]["CODIGO (WMO):"]
            }
            json_data["data"].append(json_day)
    return json_data


def process_year_directory(year_directory, output_directory):
    global_json_data = []
    for csv_file in glob.glob(os.path.join(year_directory, "*.CSV")):
        print(csv_file)
        json_data = process_data(csv_file)
        global_json_data.append(json_data)

    # Save data in a JSON file
    json_filename = os.path.join(
        output_directory, f"data_{os.path.basename(year_directory)}.json"
    )
    with open(json_filename, "w") as jsonfile:
        json.dump(global_json_data, jsonfile, indent=4)




if __name__ == "__main__":
    # Diretório raiz que contém pastas com anos (exemplo: 2020, 2021, 2022)
    root_directory = os.path.join(os.getcwd(), "years")
    # Diretório onde os arquivos JSON serão salvos
    output_directory = os.path.join(os.getcwd(), "output")
    
    # Iterar sobre as pastas de anos e processar os arquivos CSV
 
    for year_folder in glob.glob(os.path.join(root_directory, "*")):
        if os.path.isdir(year_folder):
            process_year_directory(year_folder, output_directory)
