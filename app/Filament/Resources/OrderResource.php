<?php

namespace App\Filament\Resources;

use AlperenErsoy\FilamentExport\Actions\FilamentExportHeaderAction;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;


class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Sales Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('Order ID')->sortable(),
                TextColumn::make('user.name')->label('User Name')->searchable(),
                TextColumn::make('address')->label('Address')->limit(50),
                TextColumn::make('total_harga')->label('Total Price')->sortable()->money('IDR'),
                TextColumn::make('status')->label('Status')->searchable(),
                TextColumn::make('created_at')->label('Created At')->dateTime(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'keranjang' => 'Belum dibayar',
                        'pending' => 'Pending',
                        'lunas' => 'Lunas',
                        'delivered' => 'Diantar',
                        'dibatalkan' => 'Dibatalkan'
                    ]),
            ])->actions([
                Tables\Actions\EditAction::make(),

                Action::make('Mark as Shipped')
                    ->color('success') // Button color
                    ->icon('heroicon-o-truck') // Optional icon
                    ->action(function (Order $record) {
                        $record->update(['status' => 'delivered']);
                        Notification::make()
                            ->title('Order status updated to shipped.')
                            ->icon('heroicon-o-truck')
                            ->success()
                            ->send();
                    })
                    ->requiresConfirmation() // Ask for confirmation before executing
                    ->visible(fn(Order $record) => $record->status == 'lunas'), // Hide button if already shipped
            ])->headerActions([
                FilamentExportHeaderAction::make('Export')
            ])
        ;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
