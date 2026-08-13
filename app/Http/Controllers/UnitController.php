<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function store(StoreUnitRequest $request, Property $property)
    {
        $this->authorize('update', $property); // adding a unit is a property-management action

        $unit = $property->units()->create($request->validated());

        return back()->with('success', 'Unit added.')->with('unit', $unit);
    }

    public function update(Request $request, Unit $unit)
    {
        $this->authorize('update', $unit);

        $data = $request->validate([
            'unit_number' => ['sometimes', 'required', 'string', 'max:50'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'rent_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:vacant,occupied,maintenance,reserved'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $unit->update($data);

        return back()->with('success', 'Unit updated.');
    }

    public function destroy(Unit $unit)
    {
        $this->authorize('delete', $unit);
        $unit->delete();

        return back()->with('success', 'Unit removed.');
    }
}
