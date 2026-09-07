<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Report - {{ now()->format('Y-m-d') }}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2rem; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { border: 1px solid #e5e7eb; padding: 0.75rem; font-size: 0.875rem; }
        th { background-color: #f9fafb; font-weight: 600; }
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 1.5rem;">
        <button onclick="window.print()" style="padding: 0.5rem 1rem; background: #000; color: #fff; border: none; border-radius: 0.375rem; cursor: pointer;">
            Print / Save as PDF
        </button>
    </div>

    <div class="header">
        <div>
            <h1 style="font-size: 1.5rem; margin: 0;">EstateOS Property Report</h1>
            <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">Generated on {{ now()->toFormattedDateString() }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                @foreach($headers as $header)
                    <th>{{ $header }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $row)
                <tr>
                    @foreach($row as $cell)
                        <td>{{ $cell }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
