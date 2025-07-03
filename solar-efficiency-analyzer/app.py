from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import sqlite3
import csv
import io
import datetime

app = Flask(__name__)
CORS(app)

# Setup SQLite DB
def init_db():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        voltage REAL,
        current REAL,
        efficiency REAL,
        timestamp TEXT
    )''')
    conn.commit()
    conn.close()

init_db()

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Add new data
@app.route('/data', methods=['POST'])
def add_data():
    data = request.get_json()
    voltage = data['voltage']
    current = data['current']
    timestamp = datetime.datetime.now().strftime('%H:%M:%S')
    efficiency = (voltage * current) / (20 * 2.5) * 100
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute("INSERT INTO readings (voltage, current, efficiency, timestamp) VALUES (?, ?, ?, ?)",
              (voltage, current, efficiency, timestamp))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

# Get all data
@app.route('/data', methods=['GET'])
def get_data():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute("SELECT voltage, current, efficiency, timestamp FROM readings ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify([
        {'voltage': v, 'current': c, 'efficiency': e, 'timestamp': t}
        for v, c, e, t in rows
    ])

# Export CSV
@app.route('/export', methods=['GET'])
def export_csv():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute("SELECT * FROM readings")
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Voltage', 'Current', 'Efficiency', 'Timestamp'])
    writer.writerows(rows)

    output.seek(0)
    return send_file(io.BytesIO(output.read().encode()),
                     mimetype='text/csv',
                     download_name='solar_readings.csv',
                     as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
